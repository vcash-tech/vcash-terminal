import type { Meta, StoryObj } from '@storybook/react'

import ServiceTemplate from './serviceTemplate'

const meta = {
    title: '4. Templates/Service',
    component: ServiceTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof ServiceTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    parameters: {
        backgrounds: {
            default: 'light',
            values: [{ name: 'dark', value: '#333333' }]
        }
    }
}
