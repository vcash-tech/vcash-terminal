import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import {
    logoBlue,
    welcome_betting_balkanBet,
    welcome_betting_maxBet,
    welcome_betting_meridianBet,
    welcome_betting_merkurXtip,
    welcome_betting_soccerBet,
    welcome_betting_volcano,
    welcome_gaming_playStation,
    welcome_gaming_roblox,
    welcome_gaming_steam,
    welcome_gaming_xBox,
    welcome_ips_katastar,
    welcome_ips_komunalije,
    welcome_ips_mup,
    welcome_ips_struja,
    welcome_ips_telefon
} from '@/assets/images'
import Container from '@/components/atoms/container/container'
import ServicesDark from '@/components/molecules/serviceDark/serviceDark'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'
import { useOrder } from '@/providers'
import { apiService } from '@/services/apiService'
import { POSService } from '@/services/posService'
import { generateSessionId } from '@/utilities/sessionHelper'

export default function WelcomeWithServices({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslation()
    const { setVoucherType, setCurrentStep, setSessionId, state } = useOrder()

    const { resetOrder } = useOrder()

    const [isOverlayVisible, setIsOverlayVisible] = useState(true)
    const [deviceId, setDeviceId] = useState<string>('vcsut-pending')
    const [isDeviceIdLoaded, setIsDeviceIdLoaded] = useState(false)
    const suppressNextClickRef = useRef(false)

    const handleOverlayPointerDown = (
        e: React.PointerEvent<HTMLDivElement>
    ) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault()
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
        // Do not hide here; wait for pointerup to avoid long-press click-through
    }

    const handleOverlayPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault()
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
        suppressNextClickRef.current = true
        // Hide after the current frame so no click leaks through
        requestAnimationFrame(() => {
            setIsOverlayVisible(false)
        })
    }

    useEffect(() => {
        const suppress = (event: Event) => {
            if (!suppressNextClickRef.current) return
            event.preventDefault()
            event.stopPropagation()
            suppressNextClickRef.current = false
        }
        // Capture phase to intercept before underlying handlers
        window.addEventListener('click', suppress, true)
        window.addEventListener('pointerup', suppress, true)
        window.addEventListener('touchend', suppress, true)
        return () => {
            window.removeEventListener('click', suppress, true)
            window.removeEventListener('pointerup', suppress, true)
            window.removeEventListener('touchend', suppress, true)
        }
    }, [])

    useEffect(() => {
        setVoucherType(null)
    }, [setVoucherType])

    useEffect(() => {
        console.log('resetting order')
        resetOrder()
    }, [resetOrder])

    useEffect(() => {
        const fetchDeviceId = async () => {
            try {
                const credentials = await apiService.getCredentials()
                if (credentials && credentials.device_name) {
                    setDeviceId(credentials.device_name)
                    console.log('Device ID loaded:', credentials.device_name)
                }
            } catch (error) {
                console.error('Error fetching device credentials:', error)
            } finally {
                setIsDeviceIdLoaded(true)
            }
        }
        fetchDeviceId()
    }, [])

    // Helper function to start a new order session
    const startOrderSession = () => {
        const newSessionId = generateSessionId()
        setSessionId(newSessionId)
        console.log('🆔 New session started:', newSessionId)
    }
    // Helper to navigate immediately and refresh session token in background
    const navigateWithFreshSession = useCallback(
        (destination: string) => {
            console.log('🚀 Navigating to:', destination)

            // Navigate immediately for responsive UX
            navigate(destination)

            // Refresh session token in background
            POSService.forceRecreateSession()
                .then(() => {
                    console.log('✅ Fresh session created in background')
                })
                .catch((error) => {
                    console.error(
                        '❌ Failed to create session in background, redirecting to connectivity issues:',
                        error
                    )
                    navigate('/connectivity-issues')
                })
        },
        [navigate]
    )

    return (
        <Container style={{ gap: 0 }} isFullHeight={true}>
            {isOverlayVisible && (
                <div
                    onPointerDown={handleOverlayPointerDown}
                    onPointerUp={handleOverlayPointerUp}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        backgroundColor: '#000',
                        touchAction: 'none'
                    }}>
                    {isDeviceIdLoaded && (
                        <iframe
                            title="kiosk-overlay"
                            src={`https://vcash.screenmaestro.app/app/index.html?device_id=${deviceId}`}
                            // src="/welcome"
                            style={{
                                border: 'none',
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none'
                            }}
                            allow="fullscreen"
                        />
                    )}
                </div>
            )}
            <div className="welcome-with-services">
                <Header isWelcome={true} shouldResetLanguage={true} />
                <div className="container">
                    <div className="vcash-logo">
                        <img src={logoBlue} alt="" />
                    </div>
                    <h1> {t('welcome.dark.title')}</h1>

                    <ServicesDark
                        title="welcome.dark.betting.title"
                        subtitle="welcome.dark.betting.subtitle"
                        type="betting"
                        hasAgeDisclaimer={true}
                        isComingSoon={false}
                        isSelected={true}
                        actionText={t('welcome.dark.betCta')}
                        images={[
                            {
                                src: welcome_betting_soccerBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_balkanBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_merkurXtip,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_maxBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_meridianBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_volcano,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_soccerBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_balkanBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_merkurXtip,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_maxBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_meridianBet,
                                isComingSoon: false
                            },
                            {
                                src: welcome_betting_volcano,
                                isComingSoon: false
                            }
                        ]}
                        onClick={() => {
                            startOrderSession()
                            setVoucherType('betting')
                            setCurrentStep(
                                VoucherPurchaseStep.SELECT_PAYMENT_METHOD
                            )
                            navigateWithFreshSession('/disclaimer')
                        }}
                    />

                    <ServicesDark
                        title="welcome.dark.gaming.title"
                        subtitle="welcome.dark.gaming.subtitle"
                        type="gaming"
                        hasAgeDisclaimer={false}
                        isComingSoon={!state.gamingEnabled}
                        isSelected={state.gamingEnabled}
                        actionText={t('welcome.dark.digitalCta')}
                        images={[
                            {
                                src: welcome_gaming_playStation,
                                isComingSoon: false
                            },
                            { src: welcome_gaming_steam, isComingSoon: false },
                            { src: welcome_gaming_xBox, isComingSoon: false },
                            {
                                src: welcome_gaming_roblox,
                                isComingSoon: false
                            },
                            {
                                src: welcome_gaming_playStation,
                                isComingSoon: false
                            },
                            { src: welcome_gaming_steam, isComingSoon: false },
                            { src: welcome_gaming_xBox, isComingSoon: false },
                            { src: welcome_gaming_roblox, isComingSoon: false }
                        ]}
                        onClick={() => {
                            if (!state.gamingEnabled) {
                                return
                            }
                            startOrderSession()
                            setVoucherType('gaming')
                            setCurrentStep(
                                VoucherPurchaseStep.SELECT_PAYMENT_METHOD
                            )
                            navigateWithFreshSession('/gaming')
                        }}
                    />

                    <ServicesDark
                        title="welcome.dark.ips.title"
                        subtitle="welcome.dark.ips.subtitle"
                        type="ips"
                        hasAgeDisclaimer={false}
                        isComingSoon={true}
                        isSelected={state.voucherType === 'ips'}
                        actionText={t('welcome.dark.betCta')}
                        images={[
                            { src: welcome_ips_struja, isComingSoon: false },
                            { src: welcome_ips_telefon, isComingSoon: false },
                            {
                                src: welcome_ips_komunalije,
                                isComingSoon: false
                            },
                            { src: welcome_ips_mup, isComingSoon: false },
                            { src: welcome_ips_katastar, isComingSoon: false },
                            { src: welcome_ips_struja, isComingSoon: false },
                            { src: welcome_ips_telefon, isComingSoon: false },
                            {
                                src: welcome_ips_komunalije,
                                isComingSoon: false
                            },
                            { src: welcome_ips_mup, isComingSoon: false },
                            { src: welcome_ips_katastar, isComingSoon: false }
                        ]}
                        onClick={() => {
                            startOrderSession()
                            setVoucherType('ips')
                            setCurrentStep(
                                VoucherPurchaseStep.SELECT_PAYMENT_METHOD
                            )
                        }}
                    />

                    {/* <PrimaryButton
                        isDisabled={!state.voucherType}
                        text={t('welcome.dark.buttonText')}
                        callback={() => {
                            if (!isOnline) {
                                console.log(
                                    'No internet connection, welcomePageWithServices:start'
                                )
                            }
                            if (state.voucherType === 'betting')
                                navigate('/disclaimer')
                            if (state.voucherType === 'gaming')
                                navigate('/gaming')
                        }}
                        inverted={true}
                    /> */}
                </div>
                <Footer isWelcome={true} />
            </div>
        </Container>
    )
}
