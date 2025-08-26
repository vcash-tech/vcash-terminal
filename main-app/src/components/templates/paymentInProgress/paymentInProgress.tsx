import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import ErrorNotification from '@/components/atoms/errorNotification/errorNotification'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import PaymentComplete from '@/components/templates/paymentInProgress/components/paymentComplete'
import VoucherConfirmationTemplate from '@/components/templates/voucherConfirmation/voucherConfirmationTemplate'
import VoucherErrorTemplate from '@/components/templates/voucherDataError/VoucherErrorTemplate'
import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'
import { apiTimeOut } from '@/helpers/apiWithStrictTimeout'
import { useOrder } from '@/providers'
import { TransactionService } from '@/services/transactionService'
import { VoucherResponse } from '@/types/pos/deposit'
import {
    activatePaymentSession,
    deactivatePaymentSession,
    onBuyVoucher,
    PaymentActivationError,
    printVoucher
} from '@/utilities/paymentHelper'

import InsertingCash from './components/insertingCash'

export default function PaymentInProgress() {
    const { setCurrentStep, state } = useOrder()
    const [amount, _setAmount] = useState<number>(0)
    const [error, setError] = useState<PaymentActivationError | string | null>(
        null
    )
    const [voucherRecreateAttempts, setVoucherRecreateAttempts] =
        useState<number>(0)
    const [voucherData, setVoucherData] = useState<VoucherResponse | null>(null)
    const [isPrinted, setIsPrinted] = useState<boolean | null>(null)
    const isMountedRef = useRef<boolean>(true)
    const activateIntervalRef = useRef<number | null>(null)
    const navigate = useNavigate()

    const onPrintVoucher = async (voucherData: VoucherResponse) => {
        const printResult = await printVoucher(
            voucherData,
            state.voucherType ?? '20',
            setError
        )
        console.log('🔍 DEBUG: Print success:', printResult)

        // If printing succeeded, automatically proceed to voucher confirmation
        if (printResult.success) {
            setIsPrinted(true)
            console.log(
                '🎯 Print successful - auto-proceeding to voucher confirmation'
            )
            // setCurrentStep(VoucherPurchaseStep.VOUCHER_CONFIRMATION)
            return
        }

        setIsPrinted(false)
        // not printed
        console.log(
            '❌ Print failed - staying on success screen for manual interaction'
        )
        console.log('🔍 DEBUG: voucherData after print failure:', voucherData)
    }

    const renderStepContent = () => {
        switch (state.currentStep) {
            case VoucherPurchaseStep.PRINT_VOUCHER:
                return (
                    <PaymentComplete
                        navigate={navigate}
                        isCompleted={isPrinted || false}
                        onPrimaryButtonClick={() => {
                            console.log('🔍 DEBUG: Show Voucher clicked')
                            console.log(
                                '🔍 DEBUG: voucherData available:',
                                !!voucherData
                            )
                            console.log(
                                '🔍 DEBUG: voucherData content:',
                                voucherData
                            )

                            setCurrentStep(
                                VoucherPurchaseStep.VOUCHER_CONFIRMATION
                            )
                        }}
                    />
                )

            case VoucherPurchaseStep.VOUCHER_ERROR:
                return (
                    <VoucherErrorTemplate
                        navigate={navigate}
                        onTryAgain={() => {
                            onBuyVoucher({
                                activateRef: activateIntervalRef,
                                selectedVoucherType: state.voucherType,
                                setVoucherRecreateAttempts,
                                voucherRecreateAttempts,
                                onError: () => {
                                    setError(error)
                                    setCurrentStep(
                                        VoucherPurchaseStep.VOUCHER_ERROR
                                    )
                                    setVoucherRecreateAttempts(
                                        voucherRecreateAttempts + 1
                                    )
                                },
                                onSuccess: (voucherData) => {
                                    setVoucherData(voucherData)
                                    setVoucherRecreateAttempts(0)
                                    setCurrentStep(
                                        VoucherPurchaseStep.PRINT_VOUCHER
                                    )
                                },
                                onPrintVoucher: (voucherData) =>
                                    onPrintVoucher(voucherData)
                            })
                        }}
                        voucherRecreateAttempts={voucherRecreateAttempts}
                    />
                )

            case VoucherPurchaseStep.VOUCHER_CONFIRMATION:
                return (
                    <VoucherConfirmationTemplate
                        voucherConfirmation={
                            {
                                date:
                                    voucherData?.moneyTransfer?.date &&
                                    format(
                                        new Date(
                                            voucherData?.moneyTransfer?.date
                                        ),
                                        'd MMMM, yyyy'
                                    ),
                                time:
                                    voucherData?.moneyTransfer?.date &&
                                    format(
                                        new Date(
                                            voucherData?.moneyTransfer?.date
                                        ),
                                        'hh:mm a'
                                    ),
                                voucherCode:
                                    voucherData?.moneyTransfer?.voucherCode,
                                referenceNo:
                                    voucherData?.moneyTransfer
                                        ?.moneyTransferCode,
                                terminal: `${voucherData?.moneyTransfer?.venue?.address}, ${voucherData?.moneyTransfer?.venue?.city}`,
                                amount: `${voucherData?.moneyTransfer?.amount?.toFixed(2)} ${voucherData?.moneyTransfer?.currencyCode}`,
                                type: voucherData?.moneyTransfer?.typeCode,
                                amountNumber:
                                    voucherData?.moneyTransfer?.amount,
                                currency:
                                    voucherData?.moneyTransfer?.currencyCode,
                                usage: '???'
                            } as VoucherConfirmation
                        }
                        navigate={navigate}
                    />
                )

            default:
                return <InsertingCash
                    amount={amount || 0}
                    onProcessPayment={() => {
                        setCurrentStep(VoucherPurchaseStep.PRINT_VOUCHER)
                        // call to buyVoucher
                        onBuyVoucher({
                            activateRef: activateIntervalRef,
                            selectedVoucherType: state.voucherType,
                            setVoucherRecreateAttempts,
                            voucherRecreateAttempts,
                            onError: () => {
                                setError(error)
                                setCurrentStep(
                                    VoucherPurchaseStep.VOUCHER_ERROR
                                )
                                setVoucherRecreateAttempts(
                                    voucherRecreateAttempts + 1
                                )
                            },
                            onSuccess: (voucherData) => {
                                setVoucherData(voucherData)
                                setVoucherRecreateAttempts(0)
                                setCurrentStep(
                                    VoucherPurchaseStep.PRINT_VOUCHER
                                )
                            },
                            onPrintVoucher: (voucherData) =>
                                onPrintVoucher(voucherData)
                        })
                    }}
                />
        }
    }

    // Polling for voucher amount every 3 seconds
    useEffect(() => {
        const fetchAmount = async () => {
            try {
                const response = await TransactionService.GetVoucherAmount()

                // if the current amount is > 0 and different from the previous amount,
                // reset the timer dispatch user activity event to reset inactivity timer
                console.log('Current amount:', amount)
                console.log('Fetched voucher amount:', response.amount)
                if (amount > 0 && response.amount > amount) {
                    console.log(
                        'Dispatching money-added event to reset inactivity timer'
                    )
                    window.dispatchEvent(new Event('money-added'))
                }

                _setAmount(response.amount)
            } catch (error) {
                console.error('Error fetching voucher amount:', error)
                // The HttpService will handle 401 errors and token cleanup automatically
            }
        }

        // Initial fetch
        fetchAmount()

        // Set up 3-second polling
        const amountPollingInterval = setInterval(fetchAmount, 1000)

        return () => {
            clearInterval(amountPollingInterval)
        }
    }, [amount])

    useEffect(() => {
        console.log('useEffect za aktivaciju')
        const startActivation = async () => {
            await activatePaymentSession((activationError) => {
                setError(activationError)
            })

            if (isMountedRef.current) {
                apiTimeOut(
                    activatePaymentSession((activationError) => {
                        setError(activationError)
                    }),
                    5
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

            deactivatePaymentSession()
        }
    }, [])

    return (
        <>
            <ErrorNotification
                message={error ?? ''}
                isVisible={error !== null}
                onClose={() => setError(null)}
            />
            <Container isFullHeight={true}>
                <Header />
                {renderStepContent()}
                <Footer />
            </Container>
        </>
    )
}
