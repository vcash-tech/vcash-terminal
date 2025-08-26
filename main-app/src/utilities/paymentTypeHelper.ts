import { VoucherType } from '@/providers'

export const getPaymentType = (voucherType: VoucherType): string => {
    switch (voucherType) {
        case 'betting':
            return '30'
        case 'gaming':
            return '20'
        case 'ips':
            return '20' // TODO: Update ips with proper payment type value
        default:
            return '20'
    }
}

export const VOUCHER_TYPE_MAPPING = {
    STANDARD_VOUCHER: 'Bet Vaučer',
    NON_BETTING_VOUCHER: 'Digital Vaučer',
    TERMINAL_BETTING_VOUCHER: 'Bet Vaučer',

    '10': 'Bet Vaučer',
    '20': 'Digital Vaučer',
    '30': 'Bet Vaučer'
} as const
