export enum VoucherPurchaseStep {
    HOME_START = 'home-start',
    SELECT_VOUCHER_TYPE = 'select-voucher-type',
    SELECT_PAYMENT_METHOD = 'select-payment-method',
    INSERT_CASH = 'insert-cash',
    CARD_PAYMENT = 'card-payment',
    PROCESS_PAYMENT = 'process-payment',
    VOUCHER_ERROR = 'voucher_error',
    PROMO_VOUCHER_ERROR = 'promo-voucher-error',
    PRINT_VOUCHER = 'print-voucher',
    VOUCHER_CONFIRMATION = 'voucher-confirmation',
    COMPLETE = 'complete'
}

// Ordered array of steps to maintain the flow sequence
export const VOUCHER_PURCHASE_STEPS_ORDER: VoucherPurchaseStep[] = [
    VoucherPurchaseStep.HOME_START,
    VoucherPurchaseStep.SELECT_VOUCHER_TYPE,
    VoucherPurchaseStep.SELECT_PAYMENT_METHOD,
    VoucherPurchaseStep.INSERT_CASH,
    VoucherPurchaseStep.CARD_PAYMENT,
    VoucherPurchaseStep.PROCESS_PAYMENT,
    VoucherPurchaseStep.PRINT_VOUCHER,
    VoucherPurchaseStep.VOUCHER_ERROR,
    VoucherPurchaseStep.PROMO_VOUCHER_ERROR,
    VoucherPurchaseStep.VOUCHER_CONFIRMATION,
    VoucherPurchaseStep.COMPLETE
]

// Keep the array for cases where you need to iterate over all steps
export const VOUCHER_PURCHASE_STEPS = Object.values(VoucherPurchaseStep)

export const getStepIndex = (step: VoucherPurchaseStep): number => {
    return VOUCHER_PURCHASE_STEPS_ORDER.indexOf(step)
}
