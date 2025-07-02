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

const VOUCHER_TYPE_MAPPING = {
    STANDARD_VOUCHER: 'Bet Vaučer',
    NON_BETTING_VOUCHER: 'Digital Vaučer',
    '10': 'Bet Vaučer',
    '20': 'Digital Vaučer'
} as const

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
        console.log('callActivate')
        try {
            const jwt = getJwtToken()
            console.log('jwt', jwt)
            if (!jwt) {
                setErrorMessage(t('insertCash.errors.authRequired'))
                setShowError(true)
                return
            }

            console.log('window.api.activate', window.api.activate)
            const result = await window.api.activate(jwt)
            console.log('result', result)
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
        console.log('useEffect za aktivaciju')
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

    const createVoucherPrintObject = (
        voucherResponse: VoucherResponse,
        voucherTypeId: string
    ) => {
        const { moneyTransfer } = voucherResponse

        // Format dates
        const createdAt = format(
            new Date(moneyTransfer.date),
            'dd.MM.yyyy. HH:mm'
        )
        const currentTime = format(new Date(), 'dd.MM.yyyy. HH:mm')

        // Format amount
        const formattedAmount = moneyTransfer.amount.toLocaleString('sr-RS', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })

        // Get voucher type text
        const voucherType =
            VOUCHER_TYPE_MAPPING[
                voucherTypeId as keyof typeof VOUCHER_TYPE_MAPPING
            ] || VOUCHER_TYPE_MAPPING['20'] // Default fallback

        return {
            url: 'https://market.vcash.rs/',
            voucherCode:
                moneyTransfer.voucherCode || moneyTransfer.moneyTransferCode,
            publicCode: moneyTransfer.moneyTransferCode,
            venueName: moneyTransfer.venue?.name || 'VCash Terminal',
            venueAddress: moneyTransfer.venue?.address || '',
            venueCity: moneyTransfer.venue?.city || '',
            amount: formattedAmount,
            currencyCode: moneyTransfer.currencyCode,
            createdAt,
            currentTime,
            voucherType
        }
    }

    // Function to print voucher with template renderer
    const printVoucher = async (
        voucherResponse: VoucherResponse,
        voucherTypeId: string
    ) => {
        try {
            const templateRendererUrl = import.meta.env
                .VITE_TEMPLATE_RENDERER_URL
            if (!templateRendererUrl) {
                console.error('VITE_TEMPLATE_RENDERER_URL not configured')
                setErrorMessage(
                    t('insertCash.errors.templateRendererNotConfigured')
                )
                setShowError(true)
                return
            }

            const voucherObject = createVoucherPrintObject(
                voucherResponse,
                voucherTypeId
            )

            // Convert to base64
            const jsonString = JSON.stringify(voucherObject)
            const base64Data = btoa(jsonString)

            // Construct the print URL
            const printUrl = `${templateRendererUrl}/terminal_voucher?data=${base64Data}&type=bmp`

            console.log('Printing voucher with URL:', printUrl)
            console.log('Voucher object:', voucherObject)

            const result = await window.api.print(printUrl)
            console.log('Print result:', result)

            // Check if printing failed
            if (!result.success) {
                setErrorMessage(
                    t('insertCash.errors.printFailed', {
                        message: result.message
                    })
                )
                setShowError(true)
            }
        } catch (error) {
            console.error('Error printing voucher:', error)
            setErrorMessage(t('insertCash.errors.printError'))
            setShowError(true)
        }
    }

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
            const voucherTypeId = '20' // Replace with actual voucher type ID
            const voucherData = await TransactionService.CreateVoucher({
                voucherTypeId
            })
            setVoucherData(voucherData)

            // Print the voucher with the new template renderer
            await printVoucher(voucherData, voucherTypeId)
        } catch (err) {
            console.error(err)
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
