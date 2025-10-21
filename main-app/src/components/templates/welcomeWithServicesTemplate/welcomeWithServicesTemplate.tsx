import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import {
    welcome_betting_volcanoUskoro,
    logoBlue,
    welcome_betting_balkanBet,
    welcome_betting_maxBet,
    welcome_betting_meridianBet,
    welcome_betting_merkurXtip,
    welcome_betting_soccerBet,
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

export default function WelcomeWithServices({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslation()
    const { setVoucherType, setCurrentStep, state } = useOrder()

    const { resetOrder } = useOrder()

    useEffect(() => {
        setVoucherType(null)
    }, [setVoucherType])

    useEffect(() => {
        console.log('resetting order')
        resetOrder()
    }, [resetOrder])

    return (
        <Container style={{ gap: 0 }} isFullHeight={true}>
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
                                src: welcome_betting_volcanoUskoro,
                                isComingSoon: true
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
                                src: welcome_betting_volcanoUskoro,
                                isComingSoon: true
                            }
                        ]}
                        onClick={() => {
                            setVoucherType('betting')
                            setCurrentStep(
                                VoucherPurchaseStep.SELECT_PAYMENT_METHOD
                            )
                            navigate('/disclaimer')
                        }}
                    />

                    <ServicesDark
                        title="welcome.dark.gaming.title"
                        subtitle="welcome.dark.gaming.subtitle"
                        type="gaming"
                        hasAgeDisclaimer={false}
                        isComingSoon={!state.gamingEnabled}
                        isSelected={state.gamingEnabled}
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
                            setVoucherType('gaming')
                            setCurrentStep(
                                VoucherPurchaseStep.SELECT_PAYMENT_METHOD
                            )
                            navigate('/gaming')
                        }}
                    />

                    <ServicesDark
                        title="welcome.dark.ips.title"
                        subtitle="welcome.dark.ips.subtitle"
                        type="ips"
                        hasAgeDisclaimer={false}
                        isComingSoon={true}
                        isSelected={state.voucherType === 'ips'}
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
