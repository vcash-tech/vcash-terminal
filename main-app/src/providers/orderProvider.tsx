import { ReactNode, useCallback, useReducer } from 'react'

import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'
import { OrderContext, orderReducer } from '@/providers/orderContext'
import {
    initialOrderState,
    OrderContextType,
    OrderState,
    PaymentMethod,
    VoucherType
} from '@/providers/orderTypes'

// Provider component
export interface OrderProviderProps {
    children: ReactNode
    initialSessionId?: string
}

export function OrderProvider({
    children,
    initialSessionId
}: OrderProviderProps) {
    const [state, dispatch] = useReducer(orderReducer, {
        ...initialOrderState,
        sessionId: initialSessionId || null
    })

    const setCurrentStep = useCallback((step: VoucherPurchaseStep) => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: step })
    }, [])

    const setSessionId = useCallback((sessionId: string) => {
        dispatch({ type: 'SET_SESSION_ID', payload: sessionId })
    }, [])

    const setVoucherType = useCallback((voucherType: VoucherType) => {
        dispatch({ type: 'SET_VOUCHER_TYPE', payload: voucherType })
    }, [])

    const setPaymentMethod = useCallback((paymentMethod: PaymentMethod) => {
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: paymentMethod })
    }, [])

    const setAmount = useCallback((amount: number) => {
        dispatch({ type: 'SET_AMOUNT', payload: amount })
    }, [])

    const setTransactionId = useCallback((transactionId: string) => {
        dispatch({ type: 'SET_TRANSACTION_ID', payload: transactionId })
    }, [])

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error })
    }, [])

    const updateOrderData = useCallback((data: Partial<OrderState>) => {
        dispatch({ type: 'UPDATE_ORDER_DATA', payload: data })
    }, [])

    const resetOrder = useCallback(() => {
        dispatch({ type: 'RESET_ORDER' })
    }, [])

    const setShouldShowAreYouThere = useCallback((shouldShow: boolean) => {
        dispatch({ type: 'SET_SHOULD_SHOW_ARE_YOU_THERE', payload: shouldShow })
    }, [])

    const contextValue: OrderContextType = {
        state,
        setCurrentStep,
        setSessionId,
        setVoucherType,
        setPaymentMethod,
        setAmount,
        setTransactionId,
        setError,
        updateOrderData,
        resetOrder,
        setShouldShowAreYouThere
    }

    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    )
}