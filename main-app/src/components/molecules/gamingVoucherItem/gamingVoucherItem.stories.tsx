import type { Meta, StoryObj } from '@storybook/react'
import GamingVoucherItem, { GamingVoucherItemProps } from './gamingVoucherItem'
import test from '@/assets/images/test.png'

const meta: Meta<typeof GamingVoucherItem> = {
    title: '2. Molecules/GamingVoucherItem',
    component: GamingVoucherItem,
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

type Story = StoryObj<typeof GamingVoucherItem>

export const Playstation: Story = {
    args: {
        title: 'gamingVouchers.cards.playstation.title',
        body: 'gamingVouchers.cards.playstation.body',
        image: test,
        price: 'gamingVouchers.priceFrom',
        flags: ['us', 'uk', 'cro']
    } as GamingVoucherItemProps
}

export const Xbox: Story = {
    args: {
        title: 'gamingVouchers.cards.xbox.title',
        body: 'gamingVouchers.cards.xbox.body',
        image: test,
        price: 'gamingVouchers.priceFrom',
        flags: ['us', 'uk', 'cro']
    } as GamingVoucherItemProps
}

export const Steam: Story = {
    args: {
        title: 'gamingVouchers.cards.steam.title',
        body: 'gamingVouchers.cards.steam.body',
        image: test,
        price: 'gamingVouchers.priceFrom',
        flags: ['us', 'uk', 'cro']
    } as GamingVoucherItemProps
}

export const ComingSoon: Story = {
    args: {
        title: 'gamingVouchers.cards.comingSoon.title',
        body: 'gamingVouchers.cards.comingSoon.body',
        isComing: true,
        flags: ['us', 'uk', 'cro']
    } as GamingVoucherItemProps
}
