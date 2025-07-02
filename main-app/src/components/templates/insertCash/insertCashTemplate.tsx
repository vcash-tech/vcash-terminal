import { format } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import ErrorNotification from '@/components/atoms/errorNotification/errorNotification'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { useTranslate } from '@/i18n/useTranslate'
import { AuthService } from '@/services/authService'
import { TransactionService } from '@/services/transactionService'
import { Auth } from '@/types/common/httpRequest'
import { VoucherResponse } from '@/types/pos/deposit'

import { infoCircle } from '../../../assets/icons'
import { insertCash } from '../../../assets/images'
import PaymentSuccessfulTemplate from '../paymentSuccessful/paymentSuccessfulTemplate'
import VoucherConfirmationTemplate from '../voucherConfirmation/voucherConfirmationTemplate'

export default function InsertCashTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()

    const [amount, _setAmount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [voucherData, setVoucherData] = useState<VoucherResponse | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [showError, setShowError] = useState<boolean>(false)

    // Refs to handle cleanup
    const activateIntervalRef = useRef<number | null>(null)
    const isMountedRef = useRef<boolean>(true)

    const getJwtToken = useCallback(() => {
        const token = AuthService.GetToken(Auth.Cashier)
        if (!token) {
            console.error('No cashier token available for activation')
            return null
        }
        return token.startsWith('Bearer ') ? token.substring(7) : token
    }, [])

    const callActivate = useCallback(async () => {
        try {
            const jwt = getJwtToken()
            if (!jwt) {
                setErrorMessage(t('insertCash.errors.authRequired'))
                setShowError(true)
                return
            }

            const result = await window.api.activate(jwt)
            if (!result.success) {
                setErrorMessage(
                    t('insertCash.errors.activationFailed', {
                        message: result.message
                    })
                )
                setShowError(true)
            }
        } catch (error) {
            console.error('Activation error:', error)
            setErrorMessage(t('insertCash.errors.cashAcceptorError'))
            setShowError(true)
        }
    }, [getJwtToken, t])

    const callDeactivate = useCallback(async () => {
        try {
            await window.api.deactivate()
        } catch (error) {
            console.error('Deactivation error:', error)
            // Silent failure for deactivate as per requirements
        }
    }, [])

    useEffect(() => {
        const startActivation = async () => {
            await callActivate()

            if (isMountedRef.current) {
                activateIntervalRef.current = window.setInterval(
                    callActivate,
                    5000
                )
            }
        }

        startActivation()

        return () => {
            isMountedRef.current = false

            if (activateIntervalRef.current) {
                clearInterval(activateIntervalRef.current)
                activateIntervalRef.current = null
            }

            callDeactivate()
        }
    }, [callActivate, callDeactivate])

    // useEffect(() => {
    //     // Simulate fetching the amount from a service or state
    //     const fetchAmount = async () => {
    //         const amount = await TransactionService.GetVoucherAmount()
    //         setAmount(amount.amount)
    //     }

    //     setInterval(() => fetchAmount(), 2000)
    // }, [])

    const handleBuy = async () => {
        // Clear interval and deactivate before proceeding
        if (activateIntervalRef.current) {
            clearInterval(activateIntervalRef.current)
            activateIntervalRef.current = null
        }
        await callDeactivate()

        setIsLoading(true)
        try {
            const voucherData = await TransactionService.CreateVoucher({
                voucherTypeId: '20' // Replace with actual voucher type ID
            })
            setVoucherData(voucherData)
        } catch (err) {
            console.error(err)
        }

        try {
            const result = await window.api.print(
                '1232-1312-12312-12312' // Replace with actual voucher code
            )
            console.log('Print result:', result)
        } catch {
            // printer unavailable handling
        }
        setIsLoading(false)
    }

    const handleErrorClose = () => {
        setShowError(false)
        setErrorMessage('')
    }

    if (voucherData) {
        return (
            <VoucherConfirmationTemplate
                voucherConfirmation={
                    {
                        date: format(
                            new Date(voucherData.moneyTransfer.date),
                            'd MMMM, yyyy'
                        ),
                        time: format(
                            new Date(voucherData.moneyTransfer.date),
                            'hh:mm a'
                        ),
                        referenceNo:
                            voucherData.moneyTransfer.moneyTransferCode,
                        terminal: `${voucherData.moneyTransfer.venue?.address}, ${voucherData.moneyTransfer.venue?.city}`,
                        amount: `${voucherData.moneyTransfer.amount.toFixed(2)} ${voucherData.moneyTransfer.currencyCode}`,
                        type: voucherData.moneyTransfer.typeCode,
                        usage: '???'
                    } as VoucherConfirmation
                }
                navigate={navigate}
            />
        )
    }

    if (isLoading) {
        return <PaymentSuccessfulTemplate />
    }

    return (
        <>
            <ErrorNotification
                message={errorMessage}
                isVisible={showError}
                onClose={handleErrorClose}
            />
            <Container isFullHeight={true}>
                <Header />
                <div className="insert-cash">
                    <h1>{t('insertCash.title')}</h1>
                    <h2>{t('insertCash.acceptedNotes')}</h2>
                    <img src={insertCash} alt={t('insertCash.altText')} />
                    <div className="inserted-amount">
                        {t('insertCash.insertedAmount')}:{' '}
                        <span>{amount} RSD</span>
                    </div>
                    <div className="info-box">
                        <img src={infoCircle} alt={t('common.info')} />
                        {t('insertCash.noChangeWarning')}
                    </div>
                    <PrimaryButton
                        text={t('insertCash.confirmPayment')}
                        callback={handleBuy}
                    />
                </div>
                <Footer />
            </Container>
        </>
    )
}
