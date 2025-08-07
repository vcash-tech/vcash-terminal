import { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import WireButton from '@/components/atoms/wireButton/wireButton'
import AlertModal from '@/components/organisms/alertModal/alertModal'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import SessionTimeout from '@/components/organisms/sessionTimeoutModal/sessionTimeout'
import { useTranslate } from '@/i18n/useTranslate'

export default function VoucherErrorTemplate({
    isOnline,
    navigate,
    onTryAgain,
    voucherRecreateAttempts = 0
}: {
    isOnline: boolean
    navigate: NavigateFunction
    onTryAgain?: () => void
    voucherRecreateAttempts?: number
}) {
    const { t } = useTranslate()
    const [showAreYouTherePopup, setShowAreYouTherePopup] = useState<boolean>(false)

    // TODO: Refactor this here and in parent component
    useEffect(() => {
        // Reset inactivity timer on user activity
        const handleAreYouStillThere = () => setShowAreYouTherePopup(true)
        window.addEventListener('are-you-still-there', handleAreYouStillThere)
        console.log('Listening for are-you-still-there event')
        return () => {
            window.removeEventListener('are-you-still-there', handleAreYouStillThere)
        }
    }, [showAreYouTherePopup])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isOnline) {
                navigate('/')
            }
        }, voucherRecreateAttempts > 2 ? 15000 : 30000)
        return () => clearTimeout(timer)
    }, [navigate, voucherRecreateAttempts, isOnline])

    return (
        <>
        {
            isOnline === false && (
                <AlertModal
                    title={t('alertModal.errors.offlineTitle')}
                    message={t('alertModal.errors.offlineMessage')}
                    displaySupport={true}
                />
            )
        }
        <Container isFullHeight={true}>
            <SessionTimeout isOpen={showAreYouTherePopup} onEndSession={() => navigate('/')} onClose={() => { setShowAreYouTherePopup(false)}} />
            <Header />
            <div className="voucher-error">
                <h1>{t('voucherError.title')}</h1>
                <h2>{t('voucherError.subtitle')}</h2>

                <div className="demo-wrapper">
                    <img
                        src={printVoucher}
                        alt={t('insertCash.altText')}
                        className="demo-error-illustration"
                    />
                </div>

                <div className="fallback-wrapper">
                    <div className="fallback">
                        <div>
                            <p>{t('voucherError.supportTitle')}</p>
                            <p className="support-text">
                                {t('voucherError.supportText')}
                            </p>
                        </div>
                        <WireButton>
                            062 111 5 111
                        </WireButton>
                    </div>
                </div>
                <PrimaryButton
                    callback={() => {
                        if(voucherRecreateAttempts <= 2) {
                            onTryAgain?.()
                            return
                        } 
                        navigate('/')
                    }}
                    text={t(voucherRecreateAttempts <= 2 ? 'voucherGenerated.tryAgain' : 'voucherGenerated.buttonText')}
                />
            </div>
            <Footer />
        </Container>
        </>
    )
}
