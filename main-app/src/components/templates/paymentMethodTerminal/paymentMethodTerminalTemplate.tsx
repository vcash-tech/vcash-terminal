import { NavigateFunction } from 'react-router-dom'

import { cash, creditCard } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PaymentCard from '@/components/atoms/paymentCard/paymentCard'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

export default function PaymentMethodTerminalTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()

    return (
        <Container isFullHeight={true}>
            <Header
                navigateBackUrl="/digital-services"
                navigationBackText={' '}
            />
            <div className="payment-method-terminal">
                <h1>{t('selectPaymentMethod.title')}</h1>
                <h2>{t('selectPaymentMethod.subtitle')}</h2>
                <div className="payment-methods">
                    <PaymentCard
                        image={creditCard}
                        text={t('selectPaymentMethod.cardPayment')}
                        callback={() => console.log('Card payment selected')}
                        isDisabled={true}
                    />
                    <PaymentCard
                        image={cash}
                        text={t('selectPaymentMethod.cashPayment')}
                        callback={() => navigate('/buy-voucher-cash')}
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
