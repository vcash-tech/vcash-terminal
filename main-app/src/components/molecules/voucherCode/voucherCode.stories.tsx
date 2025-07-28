import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { TranslationProvider } from '@/i18n/TranslationProvider'

import VoucherCode from './voucherCode'

const meta: Meta<typeof VoucherCode> = {
    title: '2. Molecules/Voucher Code',
    component: VoucherCode,
    parameters: {
        layout: 'centered'
    },
    args: {
        voucherCode: '123-123-123',
        voucherConfirmation: {
            amount: '130023 RSD',
            amountNumber: 1000,
            currency: 'RSD'
        } as VoucherConfirmation
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <TranslationProvider>
                    <Story />
                </TranslationProvider>
            </BrowserRouter>
        )
    ]
} satisfies Meta<typeof VoucherCode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
