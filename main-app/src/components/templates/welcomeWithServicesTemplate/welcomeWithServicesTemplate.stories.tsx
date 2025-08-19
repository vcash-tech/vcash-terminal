import type { Meta, StoryObj } from '@storybook/react'

import WelcomeWithServices from './welcomeWithServicesTemplate'

const meta = {
    title: '4. Templates/Welcome With Services Screen',
    component: WelcomeWithServices,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    args: {
        navigate: () => console.log('navigate')
    }
} satisfies Meta<typeof WelcomeWithServices>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        navigate: () => {}
    }
}