import { useEffect, useState } from 'react'
import { NavigateFunction, useLocation } from 'react-router-dom'

import { cash, creditCard } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PaymentCard from '@/components/atoms/paymentCard/paymentCard'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'
import { apiService, PosStatusResponse } from '@/services/apiService'

export default function PaymentMethodTerminalTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const location = useLocation()
    const prevState = location.state // This is the state object passed from previous navigation
    const { setPaymentMethod, setCurrentStep, state } = useOrder()
    const [status, setStatus] = useState<PosStatusResponse | null>(null)

    useEffect(() => {
        apiService
            .getPosStatus(state.sessionId ?? '')
            .then((response) => {
                setStatus(response)
            })
            .catch((error) => {
                console.error('Error getting pos status:', error)
                alert(
                    'Error getting pos status: ' +
                        JSON.stringify(error, null, 2)
                )
            })
    }, [setStatus, state])

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

    // Handle IPS payment method selection
    const handleIpsPaymentMethod = (method: 'cash' | 'card') => {
        setPaymentMethod(method)
        if (method === 'cash') {
            setCurrentStep(VoucherPurchaseStep.INSERT_CASH)
        } else {
            setCurrentStep(VoucherPurchaseStep.CARD_PAYMENT)
        }
        navigate('/buy-voucher-cash', {
            state: {
                voucherType: 'ips',
                instructions: prevState?.instructions,
                totalAmount: prevState?.totalAmount
            }
        })
    }

    return (
        <Container isFullHeight={true}>
            <Header navigateBackUrl={'/welcome'} navigationBackText={' '} />
            <div className="payment-method-terminal">
                <h1>{t('selectPaymentMethod.title')}</h1>
                <h2>{t('selectPaymentMethod.subtitle')}</h2>
                <div className="payment-methods">
                    {prevState?.voucherType === 'ips' && prevState?.totalAmount && (
                        <div className="ips-payment-info">
                            <div className="ips-payment-summary-info">
                                <span className="ips-payment-label">
                                    {t('ipsPayment.totalAmount') || 'Ukupan iznos'}:
                                </span>
                                <span className="ips-payment-amount">
                                    {prevState.totalAmount.toFixed(2)} RSD
                                </span>
                            </div>
                            {prevState?.instructions && (
                                <div className="ips-payment-count">
                                    {t('ipsPayment.instructionCount') || 'Broj naloga'}: {prevState.instructions.length}
                                </div>
                            )}
                        </div>
                    )}
                    <PaymentCard
                        image={cash}
                        text={t('selectPaymentMethod.cashPayment')}
                        // get state from the previous navigate
                        callback={() => {
                            if (prevState?.voucherType === 'ips') {
                                handleIpsPaymentMethod('cash')
                            } else {
                                setPaymentMethod('cash')
                                setCurrentStep(VoucherPurchaseStep.INSERT_CASH)
                                navigate('/buy-voucher-cash', {
                                    state: {
                                        voucherType:
                                            prevState?.voucherType || 'gaming'
                                    }
                                })
                            }
                        }}
                    />
                    <PaymentCard
                        image={creditCard}
                        text={t('selectPaymentMethod.cardPayment')}
                        callback={() => {
                            if (prevState?.voucherType === 'ips') {
                                handleIpsPaymentMethod('card')
                            } else {
                                setPaymentMethod('card')
                                setCurrentStep(VoucherPurchaseStep.CARD_PAYMENT)
                                navigate('/buy-voucher-cash', {
                                    state: {
                                        voucherType:
                                            prevState?.voucherType || 'gaming'
                                    }
                                })
                            }
                        }}
                        isDisabled={false}
                    />
                    <div>
                        Status pos:
                        {status === null ? (
                            <p>Učitavanje</p>
                        ) : (
                            <pre>{JSON.stringify(status, null, 2)}</pre>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </Container>
    )
}
