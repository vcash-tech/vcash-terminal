import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'

// Types
export type VoucherType = 'gaming' | 'betting' | 'ips' | null
export type PaymentMethod = 'cash' | 'card'

export interface OrderState {
    currentStep: VoucherPurchaseStep
    sessionId: string | null
    voucherType: VoucherType | null
    paymentMethod: PaymentMethod | null
    amount: number | null
    transactionId: string | null
    timestamp: number | null
    error: string | null
    shouldShowAreYouThere: boolean
}

export interface OrderContextType {
    state: OrderState
    setCurrentStep: (step: VoucherPurchaseStep) => void
    setSessionId: (sessionId: string) => void
    setVoucherType: (voucherType: VoucherType) => void
    setPaymentMethod: (paymentMethod: PaymentMethod) => void
    setAmount: (amount: number) => void
    setTransactionId: (transactionId: string) => void
    setError: (error: string | null) => void
    resetOrder: () => void
    updateOrderData: (data: Partial<OrderState>) => void
    setShouldShowAreYouThere: (shouldShow: boolean) => void
}

// Action types
export type OrderAction =
    | { type: 'SET_CURRENT_STEP'; payload: VoucherPurchaseStep }
    | { type: 'SET_SESSION_ID'; payload: string }
    | { type: 'SET_VOUCHER_TYPE'; payload: VoucherType }
    | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
    | { type: 'SET_AMOUNT'; payload: number }
    | { type: 'SET_TRANSACTION_ID'; payload: string }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_ORDER_DATA'; payload: Partial<OrderState> }
    | { type: 'RESET_ORDER' }
    | { type: 'SET_SHOULD_SHOW_ARE_YOU_THERE'; payload: boolean }

// Initial state
export const initialOrderState: OrderState = {
    currentStep: VoucherPurchaseStep.HOME_START,
    sessionId: null,
    voucherType: null,
    paymentMethod: null,
    amount: null,
    transactionId: null,
    timestamp: null,
    error: null,
    shouldShowAreYouThere: false
}
