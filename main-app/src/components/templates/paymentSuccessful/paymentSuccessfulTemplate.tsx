import { NavigateFunction } from 'react-router-dom'

import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

export default function PaymentSuccessfulTemplate({
        navigate
    }: {
        navigate: NavigateFunction
    }) {
    const { t } = useTranslate()

    return (
        <Container isFullHeight={true}>
            <Header />
            <div className="payment-successful">
                <h1>{t('paymentSuccessful.title')}</h1>
                <h2>{t('paymentSuccessful.subtitle')}</h2>

                <div className="demo-wrapper">
                    <img src={printVoucher} alt={t('insertCash.altText')} />
                </div>

                <div className='payment-successful-fallback'>
                    <SessionCounter />
                    <p>{t('paymentSuccessful.voucherUnavailable')}</p>
                    <PrimaryButton text={t('paymentSuccessful.buttonText')} callback={() => { navigate('/') }} />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
