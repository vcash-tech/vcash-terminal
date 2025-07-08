import { v4 as uuid } from 'uuid'

import {
    MoneyTransfer,
    StatusCode,
    TransactionType
} from '@/types/agent/transaction'
import { VoucherResponse } from '@/types/pos/deposit'

export const shouldMockPrinter = () => {
    const isDev = import.meta.env.DEV === true
    const useMockApi = import.meta.env.VITE_SHOULD_MOCK_API === 'true' && isDev

    return useMockApi
}

const mockedTransaction = (): MoneyTransfer => {
    const date = new Date()
    return {
        moneyTransferId: uuid(),
        from: {
            walletId: 12345,
            company: 'Sender Company',
            identifier: 'ID-SENDER-001',
            agentTypeCode: 'AGENT'
        },
        to: {
            walletId: 67890,
            company: 'Recipient Company',
            identifier: 'ID-RECIP-001',
            agentTypeCode: 'CUSTOMER'
        },
        amount: 1000.5,
        statusCode: StatusCode.completed,
        date: date.toISOString(),
        transactions: [
            {
                transactionId: 12345,
                ToUserIdentifier: 'ID-RECIP-001',
                amount: 1000.5,
                date,
                statusCode: StatusCode.completed,
                externalTransactionId: 'EXT-12345'
            }
        ],
        voucherCode: 'VOUCHER-' + Math.floor(1000000 + Math.random() * 9000000),
        typeCode: TransactionType.DIRECT_TRANSFER,
        moneyTransferCode: 'MT-' + Math.floor(10000 + Math.random() * 90000),
        currencyCode: 'EUR',
        cashier: {
            fullName: 'John Doe',
            cashierId: 'CASH-001'
        },
        venue: {
            name: 'Main Branch',
            venueId: 101,
            address: 'Main Street 123',
            city: 'Belgrade'
        }
    }
}

export const mockedPrinterData = (): VoucherResponse | null => {
    const voucherData: VoucherResponse = {
        moneyTransfer: mockedTransaction(),
        timestamp: Date.now()
    }

    return voucherData
}