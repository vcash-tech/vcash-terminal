import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'

import { apiTimeOut } from '@/helpers/apiWithStrictTimeout'

/**
 * State interface for internet connection status
 */
export interface InternetConnectionState {
    /** Current internet connection status */
    isOnline: boolean
    /** Whether the check is currently in progress */
    isChecking: boolean
    /** Error message if the check failed */
    error: string | null
    /** Last time the check was performed */
    lastChecked: Date | null
    /** Whether there is pending money (e.g., cash inserted not yet processed) */
    isMoneyPending: boolean
    /** Setter to update the money pending state */
    setIsMoneyPending: (value: boolean) => void
}

type InternetConnectionContextType = InternetConnectionState

const InternetConnectionContext = createContext<
    InternetConnectionContextType | undefined
>(undefined)

const HEALTH_CHECK_URL = 'https://api.vcash.rs/system/health'
const CHECK_INTERVAL = 5000 // 5 seconds

interface InternetConnectionProviderProps {
    children: ReactNode
}

/**
 * Provider component that manages internet connection checking globally.
 *
 * This provider:
 * - Starts checking internet connection immediately when mounted
 * - Continuously checks every 5 seconds
 * - Provides shared state to all components using the hook
 * - Automatically cleans up intervals and abort controllers
 *
 * Must wrap the application (or the part that needs internet connection status)
 * to enable the useCheckInternetConnection hook.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <InternetConnectionProvider>
 *       <YourAppComponents />
 *     </InternetConnectionProvider>
 *   )
 * }
 * ```
 */
export function InternetConnectionProvider({
    children
}: InternetConnectionProviderProps) {
    const [isOnline, setIsOnline] = useState<boolean>(true)
    const [isChecking, setIsChecking] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [lastChecked, setLastChecked] = useState<Date | null>(null)
    const [isMoneyPending, setIsMoneyPending] = useState<boolean>(false)

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    const performCheck = async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        const abortController = new AbortController()
        abortControllerRef.current = abortController

        setIsChecking(true)
        setError(null)

        try {
            if (
                window.location.pathname !== '/welcome-with-services' &&
                window.location.pathname !== '/welcome'
            ) {
                apiTimeOut(
                    fetch(HEALTH_CHECK_URL, {
                        method: 'GET',
                        signal: abortController.signal,
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    }),
                    5
                )
                    .then((response) => {
                        if (response) {
                            setIsOnline(true)
                            setError(null)
                        } else {
                            setIsOnline(false)
                            setError('Request timed out')
                        }
                    })
                    .catch(() => {
                        setIsOnline(false)
                        setError('Request failed')
                    })
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return
            }

            setIsOnline(false)
            setError(
                err instanceof Error ? err.message : 'Unknown error occurred'
            )
        } finally {
            setIsChecking(false)
            setLastChecked(new Date())
            abortControllerRef.current = null
        }
    }

    // Start checking immediately and set up continuous checking
    useEffect(() => {
        performCheck()

        // Set up continuous checking every 5 seconds
        intervalRef.current = setInterval(() => {
            performCheck()
        }, CHECK_INTERVAL)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
                abortControllerRef.current = null
            }
        }
    }, [])

    const value: InternetConnectionContextType = {
        isOnline,
        isChecking,
        error,
        lastChecked,
        isMoneyPending,
        setIsMoneyPending
    }

    return (
        <InternetConnectionContext.Provider value={value}>
            {children}
        </InternetConnectionContext.Provider>
    )
}

/**
 * Hook to access internet connection status from anywhere in the component tree.
 *
 * This hook provides:
 * - isOnline: boolean indicating if internet is available
 * - isChecking: boolean indicating if a check is in progress
 * - error: string | null with any error message
 * - lastChecked: Date | null with timestamp of last check
 *
 * Must be used within an InternetConnectionProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOnline, isChecking, error, lastChecked } = useCheckInternetConnection()
 *
 *   if (!isOnline) {
 *     return <div>No internet connection</div>
 *   }
 *
 *   return <div>Connected to internet</div>
 * }
 * ```
 *
 * @returns InternetConnectionState object with current connection status
 * @throws Error if used outside of InternetConnectionProvider
 */
export function useCheckInternetConnection(): InternetConnectionState {
    const context = useContext(InternetConnectionContext)
    if (context === undefined) {
        throw new Error(
            'useCheckInternetConnection must be used within an InternetConnectionProvider'
        )
    }
    return context
}
