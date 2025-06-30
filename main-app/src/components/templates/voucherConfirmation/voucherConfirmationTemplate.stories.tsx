import type { Meta, StoryObj } from '@storybook/react'

import { sampleVoucherConfirmation } from '@/data/entities/voucher-confirmation'

import VoucherConfirmationTemplate from './voucherConfirmationTemplate'

const meta = {
    title: '4. Templates/Voucher Confirmation',
    component: VoucherConfirmationTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof VoucherConfirmationTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        voucherConfirmation: sampleVoucherConfirmation,
        navigate: () => {}
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#333333' }]
        }
    }
}
