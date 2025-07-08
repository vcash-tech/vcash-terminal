import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import VoucherCode from './voucherCode'

const meta: Meta<typeof VoucherCode> = {
    title: '2. Molecules/Voucher Code',
    component: VoucherCode,
    parameters: {
        layout: 'centered'
    },
    args: {
        voucherCode: {
            voucherCode: 'XG4L-29TP-8ZRW',
            date: '27 June, 2025.',
            time: '16:43',
            referenceNo: 'TXN-8347192',
            terminal: 'Xyz Kiosk, 123 Main St, New York, NY',
            amount: '2000 RSD',
            type: 'Steam $20 Wallet',
            usage: 'Redeem on Steam via wallet page',
            qrCodeData: 'something something'
        }
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        )
    ]
} satisfies Meta<typeof VoucherCode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
