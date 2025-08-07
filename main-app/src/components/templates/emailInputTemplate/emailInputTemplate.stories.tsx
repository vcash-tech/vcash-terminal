import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import EmailInputTemplate from './emailInputTemplate'

const meta = {
    title: '4. Templates/Email Input Template',
    component: EmailInputTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
} satisfies Meta<typeof EmailInputTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        onComplete: () => console.log('Email input completed'),
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#333333' }]
        }
    },
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        )
    ]
}