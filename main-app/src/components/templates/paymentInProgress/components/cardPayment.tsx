import './_cardPayment.scss'

import { useState } from 'react'

import { creditCard } from '@/assets/images'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'
import { apiService, PosActivateResponse } from '@/services/apiService'
import { getJwtToken } from '@/utilities/paymentHelper'

export type CardPaymentProps = {
    onPaymentSuccess: (response: PosActivateResponse) => void
    onPaymentError: (error: string) => void
}

export default function CardPayment({
    onPaymentSuccess,
    onPaymentError
}: CardPaymentProps) {
    const { t } = useTranslate()
    const { state } = useOrder()
    const isGaming = state.voucherType === 'gaming'

    const [amount, setAmount] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const minAmount = isGaming ? 200 : 500
    const maxAmount = 100000
    const numericAmount = parseFloat(amount) || 0

    const handleAmountChange = (value: string) => {
        // Only allow numbers and one decimal point
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value)
        }
    }

    const handleQuickAmount = (value: number) => {
        setAmount(value.toString())
    }

    const handleConfirmPayment = async () => {
        if (!amount || numericAmount < minAmount || numericAmount > maxAmount) {
            return
        }

        setIsProcessing(true)

        try {
            // Get JWT token from auth service
            const jwt = await getJwtToken()
            if (!jwt) {
                onPaymentError('Authentication required. Please try again.')
                setIsProcessing(false)
                return
            }

            // Get session ID from order state
            const sessionId = state.sessionId || undefined

            // Call activatePos - this is a long-running operation
            const response = await apiService.activatePos(
                {
                    amount: numericAmount.toFixed(2),
                    terminalId: isGaming ? '02' : '01',
                    jwt_token: jwt,
                    currency: '941',
                    depositTypeId: 'PAYMENT_CARD_TRANSACTION',
                    voucher_type_id:
                        state.voucherType === 'betting' ? '30' : '20'
                },
                sessionId
            )

            if (response.success) {
                console.log('✅ Card payment successful:', response)
                onPaymentSuccess(response)
            } else {
                console.error('❌ Card payment failed:', response)
                onPaymentError(response.message || 'Payment failed')
            }
        } catch (error) {
            console.error('❌ Card payment error:', error)
            onPaymentError(
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'
            )
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="card-payment">
            <div>
                <h1>{t('cardPayment.title', 'Card Payment')}</h1>
                <h3>
                    {t('cardPayment.subtitle1', 'Minimum amount')}{' '}
                    <span>{isGaming ? '200 RSD' : '500 RSD'}</span>{' '}
                    {t('cardPayment.subtitle2', 'Maximum amount')}{' '}
                    <span>100.000 RSD</span>
                </h3>
            </div>

            {/* Placeholder card image */}
            <div className="demo-wrapper">
                <img src={creditCard} alt="Card Payment" />
            </div>

            {/* Amount input section */}
            <div className="amount-input-section">
                <label htmlFor="amount-input">
                    {t('cardPayment.enterAmount', 'Enter Amount')}:
                </label>
                <div className="amount-input-container">
                    <input
                        id="amount-input"
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        disabled={isProcessing}
                    />
                    <span className="currency">RSD</span>
                </div>

                {/* Quick amount buttons */}
                <div className="quick-amounts">
                    {[1000, 2000, 5000, 10000].map((quickAmount) => (
                        <button
                            key={quickAmount}
                            onClick={() => handleQuickAmount(quickAmount)}
                            disabled={isProcessing}>
                            {quickAmount} RSD
                        </button>
                    ))}
                </div>

                {/* Amount validation message */}
                {amount && numericAmount < minAmount && (
                    <div className="validation-message">
                        {t(
                            'cardPayment.minAmountError',
                            `Minimum amount is ${minAmount} RSD`
                        )}
                    </div>
                )}
                {amount && numericAmount > maxAmount && (
                    <div className="validation-message">
                        {t(
                            'cardPayment.maxAmountError',
                            `Maximum amount is ${maxAmount} RSD`
                        )}
                    </div>
                )}
            </div>

            {/* Processing indicator */}
            {isProcessing && (
                <div className="processing-indicator">
                    {t(
                        'cardPayment.pleaseWait',
                        'Please wait while we process your payment...'
                    )}
                    <br />
                    {t(
                        'cardPayment.followInstructions',
                        'Follow the instructions on the card terminal.'
                    )}
                </div>
            )}

            {/* Confirm button */}
            <div className="buttons-wrapper">
                <PrimaryButton
                    isDisabled={
                        !amount ||
                        numericAmount < minAmount ||
                        numericAmount > maxAmount ||
                        isProcessing
                    }
                    text={
                        isProcessing
                            ? t('cardPayment.processing', 'Processing...')
                            : numericAmount < minAmount
                              ? t(
                                    'cardPayment.minAmount',
                                    `Minimum ${minAmount} RSD`
                                )
                              : t(
                                    'cardPayment.confirmPayment',
                                    'Confirm Payment'
                                )
                    }
                    callback={handleConfirmPayment}
                />
            </div>
        </div>
    )
}
