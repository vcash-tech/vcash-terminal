import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

export default function PaymentSuccessfulTemplate() {
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
            </div>
            <Footer />
        </Container>
    )
}
