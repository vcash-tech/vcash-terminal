import type { Meta, StoryObj } from '@storybook/react'

import { balkanBetLogo, soccerBetLogo } from '@/assets/images'

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

export const BalkanBet: Story = {
    args: {
        title: 'bettingVouchers.cards.balkanBet.title',
        body: 'bettingVouchers.cards.balkanBet.body',
        image: balkanBetLogo
    } as BettingVoucherItemProps
}

export const SoccerBet: Story = {
    args: {
        title: 'bettingVouchers.cards.soccerBet.title',
        body: 'bettingVouchers.cards.soccerBet.body',
        image: soccerBetLogo
    } as BettingVoucherItemProps
}

export const ComingSoon: Story = {
    args: {
        title: 'bettingVouchers.cards.comingSoon.title',
        body: 'bettingVouchers.cards.comingSoon.body',
        isComing: true,
    } as BettingVoucherItemProps
}
