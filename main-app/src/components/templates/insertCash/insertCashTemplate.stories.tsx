import type { Meta, StoryObj } from '@storybook/react'

import InsertCashTemplate from './insertCashTemplate'

const meta: Meta<typeof InsertCashTemplate> = {
    title: '4. Templates/Insert Cash',
    component: InsertCashTemplate,
    parameters: {
        layout: 'centered'
    },
    args: {
        navigate: () => {}
    },
    tags: ['autodocs']
} satisfies Meta<typeof InsertCashTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
