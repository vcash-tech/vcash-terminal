import type { Meta, StoryObj } from '@storybook/react'
import VoucherItem from './voucherItem'
import { betVoucher, gamingVoucher } from '../../../assets/images'

const meta = {
    title: '2. Molecules/VoucherItem',
    component: VoucherItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#f4f7ff' },
                { name: 'dark', value: '#333333' }
            ]
        }
    }
} satisfies Meta<typeof VoucherItem>

export default meta
type Story = StoryObj<typeof meta>

export const Bet: Story = {
    args: {
        title: 'Bet Vaučer',
        subtitle: 'Za sportske kladionice, kazino i ostale igre na sreću.',
        image: betVoucher,
        variant: 'bet'
    }
}

export const Gaming: Story = {
    args: {
        title: 'Gaming Vaučer',
        subtitle: 'Kupi vaučer za Xbox, Playstation ili Steam prodavnice',
        image: gamingVoucher,
        variant: 'gaming'
    }
}
