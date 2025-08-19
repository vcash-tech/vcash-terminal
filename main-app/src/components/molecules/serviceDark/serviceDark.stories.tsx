import type { Meta, StoryObj } from '@storybook/react'

import { welcome_betting_balkanBet, welcome_betting_maxBet, welcome_betting_meridianBet, welcome_betting_merkurXtip, welcome_betting_soccerBet, welcome_gaming_playStation, welcome_gaming_roblox, welcome_gaming_steam, welcome_gaming_xBox, welcome_ips_katastar, welcome_ips_komunalije, welcome_ips_mup, welcome_ips_struja, welcome_ips_telefon } from '@/assets/images'

import ServicesDark, { serviceDarkProps } from './serviceDark'

const meta: Meta<typeof ServicesDark> = {
    title: '2. Molecules/Services Dark',
    component: ServicesDark,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#061958' }
            ]
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
        hasAgeDisclamer: true,
        isCommingSoon: false,
        isSelected: true,
        images: [
            {src: welcome_betting_soccerBet, isCommingSoon: false},
            {src: welcome_betting_balkanBet, isCommingSoon: false},
            {src: welcome_betting_merkurXtip, isCommingSoon: false},
            {src: welcome_betting_maxBet, isCommingSoon: true},
            {src: welcome_betting_meridianBet, isCommingSoon: true},
            {src: welcome_betting_soccerBet, isCommingSoon: false},
            {src: welcome_betting_balkanBet, isCommingSoon: false},
            {src: welcome_betting_merkurXtip, isCommingSoon: false},
            {src: welcome_betting_maxBet, isCommingSoon: true},
            {src: welcome_betting_meridianBet, isCommingSoon: true}
        ]
    } as serviceDarkProps
}

export const Gaming: Story = {
    args: {
        title: 'welcome.dark.gaming.title',
        subtitle: 'welcome.dark.gaming.subtitle',
        type: 'gaming',
        hasAgeDisclamer: false,
        isCommingSoon: true,
        isSelected: false,
        images: [
            {src: welcome_gaming_playStation, isCommingSoon: false},
            {src: welcome_gaming_steam, isCommingSoon: false},
            {src: welcome_gaming_xBox, isCommingSoon: false},
            {src: welcome_gaming_roblox, isCommingSoon: false},
            {src: welcome_gaming_playStation, isCommingSoon: false},
            {src: welcome_gaming_steam, isCommingSoon: false},
            {src: welcome_gaming_xBox, isCommingSoon: false},
            {src: welcome_gaming_roblox, isCommingSoon: false}
        ]
    } as serviceDarkProps
}

export const IPS: Story = {
    args: {
        title: 'welcome.dark.ips.title',
        subtitle: 'welcome.dark.ips.subtitle',
        type: 'ips',
        hasAgeDisclamer: false,
        isCommingSoon: true,
        isSelected: false,
        images: [
            {src: welcome_ips_struja, isCommingSoon: false},
            {src: welcome_ips_telefon, isCommingSoon: false},
            {src: welcome_ips_komunalije, isCommingSoon: false},
            {src: welcome_ips_mup, isCommingSoon: false},
            {src: welcome_ips_katastar, isCommingSoon: false},
            {src: welcome_ips_struja, isCommingSoon: false},
            {src: welcome_ips_telefon, isCommingSoon: false},
            {src: welcome_ips_komunalije, isCommingSoon: false},
            {src: welcome_ips_mup, isCommingSoon: false},
            {src: welcome_ips_katastar, isCommingSoon: false}
        ]
    } as serviceDarkProps
}