import { useEffect } from 'react'
import { NavigateFunction, useLocation } from 'react-router-dom'

import { cash, creditCard } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PaymentCard from '@/components/atoms/paymentCard/paymentCard'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'

export default function PaymentMethodTerminalTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const location = useLocation()
    const prevState = location.state // This is the state object passed from previous navigation
    const { setPaymentMethod, setCurrentStep } = useOrder()

    useEffect(() => {
        if (prevState?.voucherType === 'betting') {
            setPaymentMethod('cash')
            setCurrentStep(VoucherPurchaseStep.INSERT_CASH)
            navigate('/buy-voucher-cash', {
                state: {
                    voucherType: prevState?.voucherType || 'gaming'
                }
            })
        }
    }, [prevState, setPaymentMethod, setCurrentStep, navigate])

    // Don't render the payment selection if we're auto-navigating for betting vouchers
    if (prevState?.voucherType === 'betting') {
        return null
    }

    return (
        <Container isFullHeight={true}>
            <Header navigateBackUrl={'/welcome'} navigationBackText={' '} />
            <div className="payment-method-terminal">
                <h1>{t('selectPaymentMethod.title')}</h1>
                <h2>{t('selectPaymentMethod.subtitle')}</h2>
                <div className="payment-methods">
                    <PaymentCard
                        image={cash}
                        text={t('selectPaymentMethod.cashPayment')}
                        // get state from the previous navigate
                        callback={() => {
                            setPaymentMethod('cash')
                            setCurrentStep(VoucherPurchaseStep.INSERT_CASH)
                            navigate('/buy-voucher-cash', {
                                state: {
                                    voucherType:
                                        prevState?.voucherType || 'gaming'
                                }
                            })
                        }}
                    />
                    <PaymentCard
                        image={creditCard}
                        text={t('selectPaymentMethod.cardPayment')}
                        callback={() => {
                            setPaymentMethod('card')
                            setCurrentStep(VoucherPurchaseStep.CARD_PAYMENT)
                            navigate('/buy-voucher-cash', {
                                state: {
                                    voucherType:
                                        prevState?.voucherType || 'gaming'
                                }
                            })
                        }}
                        isDisabled={false}
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
