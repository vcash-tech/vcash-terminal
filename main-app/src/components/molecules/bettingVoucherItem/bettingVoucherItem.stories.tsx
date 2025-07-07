import type { Meta, StoryObj } from '@storybook/react'

import test from '@/assets/images/test.png'

import BettingVoucherItem, { BettingVoucherItemProps } from './bettingVoucherItem'

const meta: Meta<typeof BettingVoucherItem> = {
    title: '2. Molecules/Betting Voucher Item',
    component: BettingVoucherItem,
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
}

export default meta

type Story = StoryObj<typeof BettingVoucherItem>

export const Playstation: Story = {
    args: {
        title: 'gamingVouchers.cards.playstation.title',
        body: 'gamingVouchers.cards.playstation.body',
        image: test,
        price: 'gamingVouchers.priceFrom'
    } as BettingVoucherItemProps
}

export const Xbox: Story = {
    args: {
        title: 'gamingVouchers.cards.xbox.title',
        body: 'gamingVouchers.cards.xbox.body',
        image: test,
        price: 'gamingVouchers.priceFrom'
    } as BettingVoucherItemProps
}

export const Steam: Story = {
    args: {
        title: 'gamingVouchers.cards.steam.title',
        body: 'gamingVouchers.cards.steam.body',
        image: test,
        price: 'gamingVouchers.priceFrom'
    } as BettingVoucherItemProps
}

export const ComingSoon: Story = {
    args: {
        title: 'gamingVouchers.cards.comingSoon.title',
        body: 'gamingVouchers.cards.comingSoon.body',
        isComing: true,
    } as BettingVoucherItemProps
}
