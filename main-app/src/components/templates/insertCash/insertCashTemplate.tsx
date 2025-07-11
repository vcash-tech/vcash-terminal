import { format } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import ErrorNotification from '@/components/atoms/errorNotification/errorNotification'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { mockedPrinterData, shouldMockPrinter } from '@/helpers/mock.printer'
import { useTranslate } from '@/i18n/useTranslate'
import { apiService } from '@/services/apiService'
import { AuthService } from '@/services/authService'
import { TransactionService } from '@/services/transactionService'
import { Auth } from '@/types/common/httpRequest'
import { VoucherResponse } from '@/types/pos/deposit'

import { infoCircle } from '../../../assets/icons'
import { insertCashImg } from '../../../assets/images'
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
    const [isVoucherPrinting, setIsVoucherPrinting] = useState<boolean>(false)
    const [showVoucher, setShowVoucher] = useState<boolean>(false)
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

            console.log('apiService.activate', apiService.activate)
            const result = await apiService.activate(jwt)
            console.log('result', result)
            if (!result.activated) {
                setErrorMessage(t('insertCash.errors.cashAcceptorError'))
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
            await apiService.deactivate()
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

    // Polling for voucher amount every 3 seconds
    useEffect(() => {
        const fetchAmount = async () => {
            try {
                const response = await TransactionService.GetVoucherAmount()
                _setAmount(response.amount)
            } catch (error) {
                console.error('Error fetching voucher amount:', error)
                // The HttpService will handle 401 errors and token cleanup automatically
            }
        }

        // Initial fetch
        fetchAmount()

        // Set up 3-second polling
        const amountPollingInterval = setInterval(fetchAmount, 5000)

        return () => {
            clearInterval(amountPollingInterval)
        }
    }, [])

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
            url: `https://market.vcash.rs/?code=${moneyTransfer.voucherCode}`,
            voucherCode: moneyTransfer.voucherCode || '---',
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
    ): Promise<boolean> => {
        try {
            const templateRendererUrl = import.meta.env
                .VITE_TEMPLATE_RENDERER_URL
            if (!templateRendererUrl) {
                console.error('VITE_TEMPLATE_RENDERER_URL not configured')
                setErrorMessage(
                    t('insertCash.errors.templateRendererNotConfigured')
                )
                setShowError(true)
                return false
            }

            const voucherObject = createVoucherPrintObject(
                voucherResponse,
                voucherTypeId
            )

            // Convert to base64 with proper UTF-8 handling
            const jsonString = JSON.stringify(voucherObject)
            const utf8Bytes = new TextEncoder().encode(jsonString)

            // Convert Uint8Array to base64
            const base64Data = btoa(
                Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join(
                    ''
                )
            )

            // Construct the print URL
            const printUrl = `${templateRendererUrl}/terminal_voucher?rotate=180&data=${base64Data}&type=bmp`

            console.log('Printing voucher with URL:', printUrl)

            const result = await apiService.print(printUrl)
            console.log('Print result:', result)

            // Check if printing failed
            if (!result.success) {
                setErrorMessage(
                    t('insertCash.errors.printFailed', {
                        message: result.message
                    })
                )
                setShowError(true)
                return false
            }

            // Printing succeeded
            console.log('✅ Voucher printed successfully')
            return true
        } catch (error) {
            console.error('Error printing voucher:', error)
            setErrorMessage(t('insertCash.errors.printError'))
            setShowError(true)
            return false
        }
    }

    const handleBuy = async () => {
        setIsVoucherPrinting(true)

        if (shouldMockPrinter()) {
            const mockedData = mockedPrinterData()
            setVoucherData(mockedData)
            // Auto-proceed for mock data after a short delay
            setTimeout(() => setShowVoucher(true), 1000)
            return
        }

        // Clear interval and deactivate before proceeding
        if (activateIntervalRef.current) {
            clearInterval(activateIntervalRef.current)
            activateIntervalRef.current = null
        }
        await callDeactivate()

        try {
            const voucherTypeId = '20' // Replace with actual voucher type ID
            const voucherData = await TransactionService.CreateVoucher({
                voucherTypeId
            })
            setVoucherData(voucherData)

            // Print the voucher with the new template renderer
            const printSuccess = await printVoucher(voucherData, voucherTypeId)

            // If printing succeeded, automatically proceed to voucher confirmation
            if (printSuccess) {
                console.log(
                    '🎯 Print successful - auto-proceeding to voucher confirmation'
                )
                setTimeout(() => setShowVoucher(true), 200) // Small delay for UX
            } else {
                console.log(
                    '❌ Print failed - staying on success screen for manual interaction'
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleErrorClose = () => {
        setShowError(false)
        setErrorMessage('')
    }

    if (showVoucher && voucherData) {
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
                        voucherCode: voucherData.moneyTransfer.voucherCode,
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

    if (isVoucherPrinting) {
        return (
            <PaymentSuccessfulTemplate
                onPrimaryButtonClick={() => setShowVoucher(true)}
                navigate={() => navigate('/')}
            />
        )
    }

    return (
        <>
            <ErrorNotification
                message={errorMessage}
                isVisible={showError}
                onClose={handleErrorClose}
            />
            <Container isFullHeight={true}>
                <Header
                    navigationBackText={' '}
                    navigateBackUrl={'/payment-method'}
                />
                <div className="insert-cash">
                    <h1>{t('insertCash.title')}</h1>
                    <h2>{t('insertCash.acceptedNotes')}</h2>
                    <div className="demo-wrapper">
                        <img
                            src={insertCashImg}
                            alt={t('insertCash.altText')}
                        />
                    </div>
                    <div className="inserted-amount">
                        {t('insertCash.insertedAmount')}:{' '}
                        <span>{amount || 0} RSD</span>
                    </div>
                    <div className="info-box">
                        <img src={infoCircle} alt={t('common.info')} />
                        {t('insertCash.noChangeWarning')}
                    </div>
                    <PrimaryButton
                        isDisabled={!amount || amount <= 0}
                        text={t('insertCash.confirmPayment')}
                        callback={handleBuy}
                    />
                </div>
                <Footer />
            </Container>
        </>
    )
}
