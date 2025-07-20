import { z } from 'zod'

export const voucherConfirmationSchema = z.object({
    // Transaction details
    date: z.string(),
    time: z.string(),
    referenceNo: z.string(),
    terminal: z.string(),

    // Voucher details
    amount: z.string(),
    voucherCode: z.string(),
    type: z.string(),
    usage: z.string(),
    amountNumber: z.number(),
    currency: z.string(),
    // QR code information
    qrCodeData: z.string().optional()
})

// Type derived from the Zod schema
export type VoucherConfirmation = z.infer<typeof voucherConfirmationSchema>

/**
 * Default values for the voucher confirmation
 */
export const defaultVoucherConfirmation: VoucherConfirmation = {
    date: '',
    time: '',
    referenceNo: '',
    terminal: '',
    amount: '',
    voucherCode: '',
    type: '',
    usage: '',
    qrCodeData: '',
    amountNumber: 0,
    currency: ''
}

/**
 * Sample voucher confirmation data (based on the template example)
 */
export const sampleVoucherConfirmation: VoucherConfirmation = {
    date: '27 June, 2025.',
    time: '16:43',
    referenceNo: 'TXN-8347192',
    terminal: 'Xyz Kiosk, 123 Main St, New York, NY',
    amount: '2000 RSD',
    voucherCode: 'XG4L-29TP-8ZRW',
    type: 'Steam $20 Wallet',
    usage: 'Redeem on Steam via wallet page',
    qrCodeData: 'something something',
    amountNumber: 2000,
    currency: 'RSD'
}