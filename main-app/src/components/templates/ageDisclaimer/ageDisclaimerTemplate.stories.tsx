import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import AgeDisclaimerTemplate from './ageDisclaimerTemplate'

const meta = {
    title: '4. Templates/Age Disclaimer',
    component: AgeDisclaimerTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof AgeDisclaimerTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        navigate: () => console.log('Navigation triggered')
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
