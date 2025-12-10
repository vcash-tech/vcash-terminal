import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { logoWhite, tickets } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HomeCards from '@/components/organisms/homeCards/homeCards'
import { useNavigationContext } from '@/hooks/useNavigationHook'
import { useWindowSize } from '@/hooks/useWindowSize'
import { POSService } from '@/services/posService'

const RETRY_INTERVAL_SECONDS = 10

export default function ConnectivityIssuesTemplate() {
    const [countdown, setCountdown] = useState(RETRY_INTERVAL_SECONDS)
    const [isRetrying, setIsRetrying] = useState(false)
    const [retryAttempts, setRetryAttempts] = useState(0)
    const { height } = useWindowSize()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { startUrl } = useNavigationContext()
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null
    )

    const attemptSessionCreation = useCallback(async () => {
        setIsRetrying(true)
        setRetryAttempts((prev) => prev + 1)

        try {
            console.log(
                'Connectivity issues page - attempting to create session...'
            )
            await POSService.createSession()
            console.log(
                '✅ Session created successfully - navigating to welcome'
            )

            // Clear any pending timers
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
            }

            navigate(startUrl ?? '/welcome-with-services')
        } catch (error) {
            console.error('Failed to create session, will retry:', error)
            setIsRetrying(false)
            setCountdown(RETRY_INTERVAL_SECONDS)
        }
    }, [navigate, startUrl])

    // Initial attempt on mount
    useEffect(() => {
        attemptSessionCreation()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Countdown and retry logic
    useEffect(() => {
        if (isRetrying) return

        // Countdown interval
        countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    return RETRY_INTERVAL_SECONDS
                }
                return prev - 1
            })
        }, 1000)

        // Retry timeout
        retryTimeoutRef.current = setTimeout(() => {
            attemptSessionCreation()
        }, RETRY_INTERVAL_SECONDS * 1000)

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
            }
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
        }
    }, [isRetrying, attemptSessionCreation])

    return (
        <Container style={{ gap: 0 }} isFullHeight={true}>
            <Header isWelcome={true} />
            <div
                className="connectivity-issues-content"
                style={{ maxHeight: height }}>
                <div className="home-cards-container">
                    <HomeCards isAnimating={false} />
                </div>

                <div className="connectivity-main">
                    <div className="vcash-logo">
                        <img src={logoWhite} alt="" />
                    </div>

                    <svg
                        className="connectivity-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2">
                        <path d="M12 20h.01" />
                        <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                        <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
                        <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
                        <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
                        <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
                        <path d="m2 2 20 20" />
                    </svg>

                    <h1>{t('connectivityIssues.title')}</h1>
                    <p>{t('connectivityIssues.text')}</p>

                    <div className="retry-info">
                        {isRetrying ? (
                            <>
                                <div className="retry-spinner" />
                                <span className="retry-text">
                                    {t('connectivityIssues.retrying')}
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="retry-spinner" />
                                <span className="retry-text">
                                    {t('connectivityIssues.autoRetry')}
                                </span>
                                <span className="retry-countdown">
                                    {t('connectivityIssues.retryIn', {
                                        seconds: countdown
                                    })}
                                </span>
                            </>
                        )}
                        {retryAttempts > 0 && (
                            <span className="retry-attempts">
                                {t('connectivityIssues.attempts', {
                                    count: retryAttempts
                                })}
                            </span>
                        )}
                    </div>
                </div>

                <div className="tickets-container">
                    <img src={tickets} alt="" className="tickets-image" />
                </div>
            </div>
            <Footer isWelcome={true} />
        </Container>
    )
}
