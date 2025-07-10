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

export const Default: Story = {
    name: 'Default State',
    args: {
        navigate: () => {}
    }
}