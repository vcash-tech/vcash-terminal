// old callActivate
import { addDays, endOfDay, format } from 'date-fns'

import { VoucherType } from '@/providers'
import { apiService } from '@/services/apiService'
import { AuthService } from '@/services/authService'
import { TransactionService } from '@/services/transactionService'
import { Auth } from '@/types/common/httpRequest'
import { VoucherResponse } from '@/types/pos/deposit'
import {
    getPaymentType,
    VOUCHER_TYPE_MAPPING
} from '@/utilities/paymentTypeHelper'

export type PaymentActivationError = 'cashAcceptorError' | 'authRequired'

export const activatePaymentSession = async (
    voucherTypeId: string,
    onError: (error: PaymentActivationError) => void
) => {
    console.log('callActivate')
    try {
        const jwt = await getJwtToken()
        console.log('jwt', jwt)

        if (!jwt) {
            onError('authRequired')
            console.error(
                'No cashier token available for activation, showing error'
            )

            return
        }

        const result = await apiService.activate(jwt, voucherTypeId)
        console.log('result', result)
        if (!result.activated) {
            onError('cashAcceptorError')
            console.error('Cash acceptor did not activate, showing error')
        }
    } catch (error) {
        console.error('Activation error:', error)
        onError('cashAcceptorError')
        console.error('Cash acceptor did not activate, showing error')
    }
}

// old callDeactivate
export const deactivatePaymentSession = async () => {
    try {
        await apiService.deactivate()
    } catch (error) {
        console.error('Deactivation error:', error)
        // Silent failure for deactivate as per requirements
    }
}

export const getJwtToken = async () => {
    const token = AuthService.GetToken(Auth.Cashier)
    if (!token) {
        console.error('No cashier token available for activation')
        return null
    }
    return token.startsWith('Bearer ') ? token.substring(7) : token
}

export const createVoucherPrintObject = (
    voucherResponse: VoucherResponse,
    voucherTypeId: string
) => {
    const { moneyTransfer } = voucherResponse

    // Format dates
    const createdAt = format(new Date(moneyTransfer.date), 'dd.MM.yyyy. HH:mm')
    const expiry = format(
        endOfDay(addDays(new Date(moneyTransfer.date), 30)),
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
        url: `https://voucher.vcash.rs/?code=${moneyTransfer.voucherCode}`,
        voucherCode: moneyTransfer.voucherCode || '---',
        publicCode: moneyTransfer.moneyTransferCode,
        venueName: moneyTransfer.venue?.name || 'VCash Terminal',
        venueAddress: moneyTransfer.venue?.address || '',
        venueCity: moneyTransfer.venue?.city || '',
        amount: formattedAmount,
        currencyCode: moneyTransfer.currencyCode,
        createdAt,
        expiry,
        currentTime,
        voucherType
    }
}

// Function to print voucher with template renderer
export const printVoucher = async (
    voucherResponse: VoucherResponse,
    voucherTypeId: string,
    onError: (error: string) => void
): Promise<{ success: boolean; message: string }> => {
    try {
        const templateRendererUrl = import.meta.env.VITE_TEMPLATE_RENDERER_URL
        if (!templateRendererUrl) {
            console.error('VITE_TEMPLATE_RENDERER_URL not configured')
            onError('templateRendererNotConfigured')

            return {
                success: false,
                message: 'Template renderer URL not configured'
            }
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
            Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('')
        )

        // Construct the print URL
        const printUrl = `${templateRendererUrl}/terminal_voucher?rotate=180&data=${encodeURIComponent(base64Data)}&type=bmp`

        console.log('Printing voucher with URL:', printUrl)

        // Add 10-second timeout to print operation
        let timeoutRef: number | null = null
        const printPromise = apiService.print(printUrl)
        const timeoutPromise = new Promise<{
            success: boolean
            message: string
        }>((resolve) => {
            timeoutRef = window.setTimeout(() => {
                console.log(
                    '⏰ Print operation timed out after 10 seconds, assuming failed'
                )
                resolve({
                    success: false,
                    message: 'Print operation timed out, assumed failed'
                })
            }, 10000)
        })

        const result: { success: boolean; message: string } =
            await Promise.race([printPromise, timeoutPromise])
        if (timeoutRef) {
            clearTimeout(timeoutRef)
        }
        console.log('Print result:', result)

        // Check if printing failed
        if (!result.success) {
            onError('printFailed')
            // setErrorMessage(
            //     t('insertCash.errors.printFailed', {
            //         message: result.message
            //     })
            // )
            // setShowError(true)
            return { success: false, message: result.message }
        }

        // Printing succeeded or timed out (both considered successful)
        console.log('✅ Voucher printed successfully or timed out')

        return { success: true, message: 'Voucher printed successfully' }
    } catch (error) {
        console.error('Error printing voucher:', error)
        onError('printError')
        return { success: false, message: 'Error printing voucher' }
    }
}

export type BuyVoucherParams = {
    selectedVoucherType: VoucherType | null
    voucherRecreateAttempts: number
    setVoucherRecreateAttempts: (attempts: number) => void
    onError: (error: string) => void
    onSuccess: (data: VoucherResponse) => void
    onPrintVoucher: (voucherData: VoucherResponse) => void
}

export const onBuyVoucher = async ({
    selectedVoucherType,
    setVoucherRecreateAttempts,
    voucherRecreateAttempts,
    onError,
    onSuccess,
    onPrintVoucher
}: BuyVoucherParams) => {
    try {
        // await new Promise((resolve) => setTimeout(resolve, 1500))
        // if (voucherRecreateAttempts < 5) {
        //     setVoucherRecreateAttempts(voucherRecreateAttempts + 1)
        //     onError('voucherCreatedFailed')
        //     return
        // }
        const createVoucher = await TransactionService.CreateVoucher({
            voucherTypeId: getPaymentType(selectedVoucherType)
        })

        if (!createVoucher || !createVoucher?.moneyTransfer?.voucherCode) {
            console.log('❌ Voucher create failed - no voucher data available')
            setVoucherRecreateAttempts(voucherRecreateAttempts + 1)
            onError('voucherCreatedFailed')

            return
        }

        setVoucherRecreateAttempts(0)
        onSuccess(createVoucher)
        console.log('🔍 DEBUG: voucherData set to:', createVoucher)
        // Print the voucher with the new template renderer
        if (createVoucher && createVoucher?.moneyTransfer?.voucherCode) {
            onPrintVoucher(createVoucher)
        } else {
            console.log('❌ Voucher create failed - no voucher data available')
            onError('voucherCreatedFailed')
        }
    } catch (err) {
        // not printed
        // setShowPrintVoucher(true)
        // if (!voucherData?.moneyTransfer?.voucherCode) {
        //     setShouldShowVoucherError(true)
        // }
        onError('voucherCreatedFailed')
        console.error('🔍 DEBUG: Error in onBuyVoucher:', err)
        console.log('🔍 DEBUG: voucherData after error:')
    }
}
