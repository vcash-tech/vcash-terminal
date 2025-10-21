import { format } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import ErrorNotification from '@/components/atoms/errorNotification/errorNotification'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import VoucherScannerModal from '@/components/organisms/voucherScannerModal/voucherScannerModal'
import PaymentComplete from '@/components/templates/paymentInProgress/components/paymentComplete'
import VoucherConfirmationTemplate from '@/components/templates/voucherConfirmation/voucherConfirmationTemplate'
import VoucherErrorTemplate from '@/components/templates/voucherDataError/VoucherErrorTemplate'
import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'
import { useCheckInternetConnection } from '@/hooks'
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
    const { isOnline, setIsMoneyPending } = useCheckInternetConnection()
    const { setCurrentStep, state } = useOrder()
    const [amount, _setAmount] = useState<number>(0)
    const [error, setError] = useState<PaymentActivationError | string | null>(
        null
    )
    const [voucherRecreateAttempts, setVoucherRecreateAttempts] =
        useState<number>(0)
    const [voucherData, setVoucherData] = useState<VoucherResponse | null>(null)
    const [isPrinted, setIsPrinted] = useState<boolean>(false)
    const [hasPrintingError, setHasPrintingError] = useState<boolean>(false)
    const [isVoucherScannerOpen, setIsVoucherScannerOpen] =
        useState<boolean>(true)
    const acceptorIntervalRef = useRef<number | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        let timeoutRef: number | null = null
        if (isPrinted) {
            timeoutRef = window.setTimeout(() => {
                navigate('/welcome')
            }, 5000)
        }
        return () => {
            if (timeoutRef) {
                clearTimeout(timeoutRef)
            }
        }
    }, [isPrinted, navigate])

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
        setHasPrintingError(true)
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
                        isPrintCompleted={isPrinted}
                        hasPrintingError={hasPrintingError}
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
                return (
                    <InsertingCash
                        amount={amount || 0}
                        onProcessPayment={() => {
                            setCurrentStep(VoucherPurchaseStep.PRINT_VOUCHER)
                            // call to buyVoucher
                            onBuyVoucher({
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
                        onUsePreviousVoucher={() => {
                            setIsVoucherScannerOpen(true)
                        }}
                    />
                )
        }
    }

    // Polling for voucher amount every 3 seconds
    useEffect(() => {
        const fetchAmount = async () => {
            try {
                const response = await TransactionService.GetVoucherAmount()

                // if the current amount is > 0 and different from the previous amount,
                // reset the timer dispatch user activity event to reset inactivity timer
                if (response.amount > 0) {
                    setIsMoneyPending(true)
                } else {
                    setIsMoneyPending(false)
                }
                if (response.amount > amount) {
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
    }, [amount, setIsMoneyPending])

    useEffect(() => {
        if (!isOnline) {
            if (acceptorIntervalRef.current) {
                clearInterval(acceptorIntervalRef.current)
                acceptorIntervalRef.current = null
                deactivatePaymentSession()
            }
            return
        }

        if (state.currentStep !== VoucherPurchaseStep.INSERT_CASH) {
            if (acceptorIntervalRef.current) {
                clearInterval(acceptorIntervalRef.current)
                acceptorIntervalRef.current = null
                deactivatePaymentSession()
            }
            return
        } else {
            if (acceptorIntervalRef.current == null && isOnline) {
                activatePaymentSession((activationError) => {
                    setError(activationError)
                })
                acceptorIntervalRef.current = window.setInterval(async () => {
                    if (!acceptorIntervalRef.current) {
                        return
                    }
                    await activatePaymentSession((activationError) => {
                        setError(activationError)
                    })
                }, 5000)
            }
        }

        return () => {
            if (acceptorIntervalRef.current) {
                clearInterval(acceptorIntervalRef.current)
                acceptorIntervalRef.current = null
            }
            deactivatePaymentSession()
        }
    }, [state, isOnline, setIsMoneyPending])

    useEffect(() => () => setIsMoneyPending(false), [])

    const onScan = useCallback(
        (value: string) => {
            console.log('🔍 DEBUG: Voucher scanned:', value)
            setIsVoucherScannerOpen(false)
            const createDraftFromVoucher = async () => {
                try {
                    const url = new URL(value)
                    const voucherCode = url.searchParams.get('code')
                    if (!voucherCode) {
                        throw new Error('Voucher code not found')
                    }
                    await TransactionService.CreateDraftFromVoucher({
                        voucherCode: voucherCode
                    })
                    console.log('uspjelo')
                } catch (error) {
                    console.error('Error creating draft from voucher:', error)
                }
            }
            createDraftFromVoucher()
        },
        [setIsVoucherScannerOpen]
    )
    const onClose = useCallback(() => {
        setIsVoucherScannerOpen(false)
    }, [setIsVoucherScannerOpen])

    return (
        <>
            <ErrorNotification
                message={error ?? ''}
                isVisible={error !== null}
                onClose={() => setError(null)}
            />
            <Container isFullHeight={true}>
                {amount === 0 &&
                state.currentStep === VoucherPurchaseStep.INSERT_CASH ? (
                    <Header
                        navigateBackUrl={'/betting'}
                        navigationBackText={' '}
                    />
                ) : (
                    <Header />
                )}

                {renderStepContent()}
                <Footer />
            </Container>
            <VoucherScannerModal
                isOpen={isVoucherScannerOpen}
                onScan={onScan}
                onClose={onClose}
            />
        </>
    )
}
