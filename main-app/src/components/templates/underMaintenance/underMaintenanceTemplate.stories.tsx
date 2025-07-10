import type { Meta, StoryObj } from '@storybook/react'

import UnderMaintenance from './underMaintenanceTemplate'

const meta = {
    title: '4. Templates/Under Maintanace Screen',
    component: UnderMaintenance,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    args: {
        navigate: () => console.log('navigate')
    }
} satisfies Meta<typeof UnderMaintenance>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    name: 'Default State',
    args: {
        navigate: () => {}
    }
}