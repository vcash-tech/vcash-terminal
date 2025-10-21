import { createContext, useContext } from 'react'

import {
    initialOrderState,
    OrderAction,
    OrderContextType,
    OrderState
} from './orderTypes' // Reducer

// Reducer
export function orderReducer(
    state: OrderState,
    action: OrderAction
): OrderState {
    switch (action.type) {
        case 'SET_CURRENT_STEP':
            return {
                ...state,
                currentStep: action.payload,
                timestamp: Date.now()
            }
        case 'SET_SESSION_ID':
            return {
                ...state,
                sessionId: action.payload,
                timestamp: Date.now()
            }
        case 'SET_VOUCHER_TYPE':
            return {
                ...state,
                voucherType: action.payload,
                timestamp: Date.now()
            }
        case 'SET_PAYMENT_METHOD':
            return {
                ...state,
                paymentMethod: action.payload,
                timestamp: Date.now()
            }
        case 'SET_GAMING_ENABLED':
            return {
                ...state,
                gamingEnabled: action.payload,
                timestamp: Date.now()
            }
        case 'SET_AMOUNT':
            return {
                ...state,
                amount: action.payload,
                timestamp: Date.now()
            }
        case 'SET_TRANSACTION_ID':
            return {
                ...state,
                transactionId: action.payload,
                timestamp: Date.now()
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                timestamp: Date.now()
            }
        case 'UPDATE_ORDER_DATA':
            return {
                ...state,
                ...action.payload,
                timestamp: Date.now()
            }
        case 'RESET_ORDER':
            return {
                ...initialOrderState,
                sessionId: state.sessionId // Keep session ID on reset
            }
        case 'SET_SHOULD_SHOW_ARE_YOU_THERE':
            return {
                ...state,
                shouldShowAreYouThere: action.payload,
                timestamp: Date.now()
            }

        default:
            return state
    }
}

// Context
export const OrderContext = createContext<OrderContextType | undefined>(
    undefined
)

// Hook to use the order context
export function useOrder(): OrderContextType {
    const context = useContext(OrderContext)
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider')
    }
    return context
}
