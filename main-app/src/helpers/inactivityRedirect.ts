import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INACTIVITY_TIME = 1 * 60 * 1000 // 1 minute in milliseconds

export default function useInactivityRedirect(redirectPath = '/welcome') {
    const navigate = useNavigate()
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [currentCycle, setCurrentCycle] = useState(0)

    useEffect(() => {
        const refreshCycle: number = Number(localStorage.getItem('refreshCycle')) || 0
        const resetTimer = () => {
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                // Get current location at timeout time, not when effect was created
                const currentPath = window.location.pathname
                if (
                    !['/register', '/under-maintenance'].includes(
                        currentPath
                    )
                ) {
                    // Only redirect if not already on the redirect path or in register/maintenance pages
                    if(currentPath !== '/buy-voucher-cash') {
                        // hard redirect to avoid issues with service worker that works only on browser reload, redirect, ...
                        
                        // hard redirecty every 15 cycles
                        if (refreshCycle >= 15 && navigator.onLine) {
                            console.log(`HARD redirect to ${redirectPath} in cycle ${refreshCycle}`)
                            localStorage.setItem('refreshCycle', '0')
                            setCurrentCycle(0)
                            window.location.href = redirectPath
                        } else {
                            const currentRefreshCycle = refreshCycle + 1
                            console.log(`SOFT redirect to ${redirectPath} in cycle ${currentRefreshCycle}`)
                            localStorage.setItem('refreshCycle', currentRefreshCycle.toString())
                            setCurrentCycle(currentRefreshCycle)
                            navigate(redirectPath)
                        }
                    } else {
                        console.log('Dispatch are-you-still-there event')
                        window.dispatchEvent(new Event('are-you-still-there'))
                        resetTimer()
                    }

                }
            }, INACTIVITY_TIME)
        }

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'money-added']

        events.forEach((event) => window.addEventListener(event, resetTimer))

        resetTimer() // start timer on mount

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer))
            if (timer.current) clearTimeout(timer.current)
        }
    }, [navigate, redirectPath, currentCycle]) // Include dependencies but not location
}
