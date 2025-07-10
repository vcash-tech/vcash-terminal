import type { Meta, StoryObj } from '@storybook/react'

import UnderMaintanace from './underMaintanaceTemplate'

const meta = {
    title: '4. Templates/Under Maintanace Screen',
    component: UnderMaintanace,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    args: {
        navigate: () => console.log('navigate')
    }
} satisfies Meta<typeof UnderMaintanace>

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