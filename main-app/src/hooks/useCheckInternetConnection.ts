import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseCheckInternetConnectionProps {
  /** Whether to start checking internet connection */
  shouldCheck: boolean
  /** Whether to check continuously (every 5 seconds) or only once */
  continuous?: boolean
}

export interface UseCheckInternetConnectionReturn {
  /** Current internet connection status */
  isOnline: boolean
  /** Whether the check is currently in progress */
  isChecking: boolean
  /** Error message if the check failed */
  error: string | null
  /** Last time the check was performed */
  lastChecked: Date | null
  /** Manually trigger a single check */
  checkNow: () => void
}

const HEALTH_CHECK_URL = 'https://api.vcash.rs/system/health'
const CHECK_INTERVAL = 5000 // 5 seconds

export const useCheckInternetConnection = ({
  shouldCheck,
  continuous = false
}: UseCheckInternetConnectionProps): UseCheckInternetConnectionReturn => {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const performCheck = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setIsChecking(true)
    setError(null)

    try {
      const response = await fetch(HEALTH_CHECK_URL, {
        method: 'GET',
        signal: abortController.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (response.ok) {
        // setIsOnline(true)
        // setError(null)
        setIsOnline(false)
        setError(`Health check failed with status: ${response.status}`)
      } else {
        setIsOnline(false)
        setError(`Health check failed with status: ${response.status}`)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      setIsOnline(false)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsChecking(false)
      setLastChecked(new Date())
      abortControllerRef.current = null
    }
  }, [])

  const checkNow = useCallback(() => {
    if (!isChecking) {
      performCheck()
    }
  }, [performCheck, isChecking])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    if (!shouldCheck) {
      return
    }

    performCheck()

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
  }, [shouldCheck, performCheck])

  useEffect(() => {
    if (!shouldCheck || !continuous) {
      return
    }

    if (!isOnline && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        performCheck()
      }, CHECK_INTERVAL)
    } else if (isOnline && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [shouldCheck, continuous, isOnline, performCheck])

  return {
    isOnline,
    isChecking,
    error,
    lastChecked,
    checkNow
  }
}