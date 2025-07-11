import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const INACTIVITY_TIME = 1 * 60 * 1000 // 1 minute in milliseconds

export default function useInactivityRedirect(redirectPath = '/welcome') {
    const navigate = useNavigate()
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const resetTimer = () => {
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                // Get current location at timeout time, not when effect was created
                const currentPath = window.location.pathname
                if (
                    currentPath !== redirectPath &&
                    !['/register', '/', '/under-maintenance'].includes(
                        currentPath
                    )
                ) {
                    // Only redirect if not already on the redirect path or in register/maintenance pages
                    navigate(redirectPath)
                }
            }, INACTIVITY_TIME)
        }

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

        events.forEach((event) => window.addEventListener(event, resetTimer))

        resetTimer() // start timer on mount

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            )
            if (timer.current) clearTimeout(timer.current)
        }
    }, [navigate, redirectPath]) // Include dependencies but not location
}
