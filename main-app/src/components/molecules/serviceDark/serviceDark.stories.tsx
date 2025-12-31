import type { Meta, StoryObj } from '@storybook/react'

import {
    welcome_betting_balkanBet,
    welcome_betting_maxBet,
    welcome_betting_merkurXtip,
    welcome_betting_soccerBet,
    welcome_gaming_playStation,
    welcome_gaming_roblox,
    welcome_gaming_steam,
    welcome_gaming_xBox,
    welcome_ips_katastar,
    welcome_ips_komunalije,
    welcome_ips_mup,
    welcome_ips_struja,
    welcome_ips_telefon
} from '@/assets/images'

import ServicesDark, { serviceDarkProps } from './serviceDark'

const meta: Meta<typeof ServicesDark> = {
    title: '2. Molecules/Services Dark',
    component: ServicesDark,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#061958' }]
        }
    }
}

export default meta

type Story = StoryObj<typeof ServicesDark>

export const Betting: Story = {
    args: {
        title: 'welcome.dark.betting.title',
        subtitle: 'welcome.dark.betting.subtitle',
        type: 'betting',
        hasAgeDisclaimer: true,
        isComingSoon: false,
        isSelected: true,
        images: [
            { src: welcome_betting_soccerBet, isComingSoon: false },
            { src: welcome_betting_balkanBet, isComingSoon: false },
            { src: welcome_betting_merkurXtip, isComingSoon: false },
            // { src: welcome_betting_maxBet, isComingSoon: true },
            { src: welcome_betting_soccerBet, isComingSoon: false },
            { src: welcome_betting_balkanBet, isComingSoon: false },
            { src: welcome_betting_merkurXtip, isComingSoon: false }
            // { src: welcome_betting_maxBet, isComingSoon: true }
        ]
    } as serviceDarkProps
}

export const Gaming: Story = {
    args: {
        title: 'welcome.dark.gaming.title',
        subtitle: 'welcome.dark.gaming.subtitle',
        type: 'gaming',
        hasAgeDisclaimer: false,
        isComingSoon: true,
        isSelected: false,
        images: [
            { src: welcome_gaming_playStation, isComingSoon: false },
            { src: welcome_gaming_steam, isComingSoon: false },
            { src: welcome_gaming_xBox, isComingSoon: false },
            { src: welcome_gaming_roblox, isComingSoon: false },
            { src: welcome_gaming_playStation, isComingSoon: false },
            { src: welcome_gaming_steam, isComingSoon: false },
            { src: welcome_gaming_xBox, isComingSoon: false },
            { src: welcome_gaming_roblox, isComingSoon: false }
        ]
    } as serviceDarkProps
}

export const IPS: Story = {
    args: {
        title: 'welcome.dark.ips.title',
        subtitle: 'welcome.dark.ips.subtitle',
        type: 'ips',
        hasAgeDisclaimer: false,
        isComingSoon: true,
        isSelected: false,
        images: [
            { src: welcome_ips_struja, isComingSoon: false },
            { src: welcome_ips_telefon, isComingSoon: false },
            { src: welcome_ips_komunalije, isComingSoon: false },
            { src: welcome_ips_mup, isComingSoon: false },
            { src: welcome_ips_katastar, isComingSoon: false },
            { src: welcome_ips_struja, isComingSoon: false },
            { src: welcome_ips_telefon, isComingSoon: false },
            { src: welcome_ips_komunalije, isComingSoon: false },
            { src: welcome_ips_mup, isComingSoon: false },
            { src: welcome_ips_katastar, isComingSoon: false }
        ]
    } as serviceDarkProps
}
