import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const INACTIVITY_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds

export default function useInactivityRedirect(redirectPath = '/welcome') {
    const navigate = useNavigate()
    const location = useLocation()
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const resetTimer = () => {
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            if (location.pathname !== redirectPath)
                // Only redirect if not already on the redirect path
                navigate(redirectPath)
        }, INACTIVITY_TIME)
    }

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

        events.forEach((event) => window.addEventListener(event, resetTimer))

        resetTimer() // start timer on mount

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            )
            if (timer.current) clearTimeout(timer.current)
        }
    }, [resetTimer])
}