import { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import HelpButton from '@/components/atoms/helpButton/helpButton'
import WireButton from '@/components/atoms/wireButton/wireButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HowTo from '@/components/organisms/how-to/how-to'
import { useTranslate } from '@/i18n/useTranslate'

export default function PaymentSuccessfulTemplate({
    navigate
}: {
    navigate: NavigateFunction
    onPrimaryButtonClick?: () => void
}) {
    const { t } = useTranslate()
    const [showHelp, setShowHelp] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHelp(true)
        }, 10000)
        return () => clearTimeout(timer)
    }, [])

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
                    {showHelp && (
                        <div className="fallback">
                            <div>
                                <p>{t('paymentSuccessful.fallbackTitle')}</p>
                                <p>
                                    {t('paymentSuccessful.voucherUnavailable')}
                                </p>
                            </div>
                            <WireButton onClick={() => navigate('/')}>
                                {t('paymentSuccessful.buttonText')}
                            </WireButton>
                        </div>
                    )}
                    <div>
                        {/*<SessionCounter onEndSession={() => navigate('/')} />*/}
                    </div>
                </div>
            </div>
            <Footer />
            {isModalOpen && (
                <HowTo isModal={true} onClose={() => setIsModalOpen(false)} />
            )}
            <HelpButton
                onPress={() => {
                    setIsModalOpen(true)
                }}
            />
        </Container>
    )
}
