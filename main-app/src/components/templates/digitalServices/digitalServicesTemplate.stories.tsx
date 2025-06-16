import type { Meta, StoryObj } from '@storybook/react'

import { services } from '@/data/mocks/digitalService.mock'

import DigitalServicesTemplate from './digitalServicesTemplate'

const meta = {
    title: '4. Templates/Digital Services',
    component: DigitalServicesTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof DigitalServicesTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        ...services
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#333333' }]
        }
    }
}
