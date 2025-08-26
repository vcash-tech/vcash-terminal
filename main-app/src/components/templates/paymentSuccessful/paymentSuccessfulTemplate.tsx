// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { confirmedIcon, printerIco } from '@/assets/icons'
import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
// import HelpButton from '@/components/atoms/helpButton/helpButton'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import WireButton from '@/components/atoms/wireButton/wireButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
// import HowTo from '@/components/organisms/how-to/how-to'
import { useTranslate } from '@/i18n/useTranslate'

export default function PaymentSuccessfulTemplate({
    showHelp,
    navigate,
    onPrimaryButtonClick,
}: {
    showHelp?: unknown
    navigate?: NavigateFunction
    onPrimaryButtonClick?: () => void
}) {
    const { t } = useTranslate()
    // const [isModalOpen, setIsModalOpen] = useState(false)
    const navigateToHome = () => {
        if (navigate) {
            navigate('/')
        }
    }

    const [showHelpMessage, setShowHelpMessage] = useState<unknown>(showHelp)

    useEffect(() => {
        // If showHelp is null or undefined, set it to true after 10 seconds
        if(showHelpMessage === null || showHelpMessage === undefined) {
            const timer = setTimeout(() => {
                setShowHelpMessage(true)
            }, 10000)
            return () => clearTimeout(timer)
        }

        // if voucher is printed navigate to / after 10 seconds
        if (showHelpMessage === false && navigate) {
            const timer = setTimeout(() => {
                navigate('/')
            }, 10000)
            return () => clearTimeout(timer)
        } 
        
        
    }, [showHelpMessage, navigate])


    return (
        <Container isFullHeight={true}>
            <Header />
            <div className="payment-successful">
                <h1>{t('paymentSuccessful.title')}</h1>
                <h2>{t('paymentSuccessful.subtitle')}</h2>

                <div className="demo-wrapper">
                    <img src={printVoucher} alt={t('insertCash.altText')} />
                </div>

                <div className="fallback-wrapper">
                    {showHelpMessage === true && (
                        <div className="fallback">
                            <div>
                                <p>{t('paymentSuccessful.fallbackTitle')}</p>
                                <p>
                                    {t('paymentSuccessful.voucherUnavailable')}
                                </p>
                            </div>
                            <WireButton onClick={onPrimaryButtonClick}>
                                {t('paymentSuccessful.buttonText')}
                            </WireButton>
                        </div>
                    )}
                    {showHelpMessage === false && (
                        <>
                        <div className="successful-msg"><img src={confirmedIcon} alt='Confirm icon' />{t('voucherGenerated.successfulMsg')}</div>
                        <PrimaryButton
                                callback={navigateToHome}
                                text={t('voucherGenerated.btnFinish')}
                            />
                        </>
                    )}
                     {(showHelpMessage === null || showHelpMessage === undefined) && (
                        <div className="successful-msg marginOn"><img src={printerIco} alt='Printer icon' />{t('voucherGenerated.inProgressMsg')}</div>
                     )}
                </div>
            </div>
            <Footer />
            {/* {isModalOpen && (
                <HowTo isModal={true} onClose={() => setIsModalOpen(false)} />
            )}
            <HelpButton
                onPress={() => {
                    setIsModalOpen(true)
                }}
            /> */}
        </Container>
    )
}
