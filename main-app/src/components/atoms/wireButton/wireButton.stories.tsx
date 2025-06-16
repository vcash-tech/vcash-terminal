import type { Meta, StoryObj } from '@storybook/react'

import WireButton from './wireButton'

const meta = {
    title: '1. Atoms/Wire Button',
    component: WireButton,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof WireButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Wire Button'
    }
}
