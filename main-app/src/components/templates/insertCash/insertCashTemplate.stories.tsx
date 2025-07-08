import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

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
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        )
    ]
} satisfies Meta<typeof InsertCashTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
