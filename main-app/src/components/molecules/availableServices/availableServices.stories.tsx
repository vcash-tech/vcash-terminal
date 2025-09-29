import type { Meta, StoryObj } from '@storybook/react'

import {
    betting_balkanBet,
    betting_merkurXtip,
    betting_soccerBet,
    gaming_josServisaUskoro,
    gaming_playstation,
    gaming_steam,
    gaming_xbox
} from '@/assets/images'

import AvailableServices, { AvailableServicesProps } from './availableServices'

const meta: Meta<typeof AvailableServices> = {
    title: '2. Molecules/Available Services',
    component: AvailableServices,
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

type Story = StoryObj<typeof AvailableServices>

export const Betting: Story = {
    args: {
        title: 'bettingVouchers.availableServices',
        images: [betting_balkanBet, betting_soccerBet, betting_merkurXtip]
    } as AvailableServicesProps
}

export const Gaming: Story = {
    args: {
        title: 'gamingVouchers.availableServices',
        images: [
            gaming_xbox,
            gaming_steam,
            gaming_playstation,
            gaming_josServisaUskoro
        ]
    } as AvailableServicesProps
}
