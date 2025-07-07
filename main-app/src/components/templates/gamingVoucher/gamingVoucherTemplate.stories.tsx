import type { Meta, StoryObj } from '@storybook/react'

import GamingVoucherTemplate from './gamingVoucherTemplate'

const meta = {
    title: '4. Templates/Gaming Voucher',
    component: GamingVoucherTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof GamingVoucherTemplate>

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
