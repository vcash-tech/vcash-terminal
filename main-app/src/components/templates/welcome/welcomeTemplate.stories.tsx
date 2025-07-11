import type { Meta, StoryObj } from '@storybook/react'

import Welcome from './welcomeTemplate'

const meta = {
    title: '4. Templates/Welcome Screen',
    component: Welcome,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    args: {
        navigate: () => console.log('navigate')
    }
} satisfies Meta<typeof Welcome>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {
    name: 'Inactive State',
    args: {
        navigate: () => {}
    }
}

export const Active: Story = {
    name: 'Active State',
    args: {
        navigate: () => {}
    }
}