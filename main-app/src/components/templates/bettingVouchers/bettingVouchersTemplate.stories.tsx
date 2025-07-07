import type { Meta, StoryObj } from '@storybook/react'

import BettingVoucherTemplate from './bettingVouchersTemplate'

const meta = {
    title: '4. Templates/Betting Voucher',
    component: BettingVoucherTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof BettingVoucherTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    parameters: {
        backgrounds: {
            default: 'light',
            values: [{ name: 'dark', value: '#333333' }]
        }
    }
}
