import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { withTranslationDemo } from '@/i18n/storybook/TranslationDecorator'

import EmailInputTemplate from './emailInputTemplate'

const meta = {
    title: '4. Templates/Email Input Template',
    component: EmailInputTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        )
    ]
} satisfies Meta<typeof EmailInputTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {},
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#333333' }]
        }
    }
}

export const WithTranslationDemo: Story = {
    args: {},
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#333333' }]
        }
    },
    decorators: [withTranslationDemo]
}
