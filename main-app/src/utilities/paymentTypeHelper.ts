import { VoucherType } from '@/providers'

export const getPaymentType = (voucherType: VoucherType | null): string => {
    switch (voucherType) {
        case 'betting':
            return '30' // TODO!! temporary workaround to test gaming vouchers without implementing the proper payment type value
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
    gaming: 'Digital Vaučer',
    betting: 'Bet Vaučer',

    '10': 'Bet Vaučer',
    '20': 'Digital Vaučer',
    '30': 'Bet Vaučer'
} as const
