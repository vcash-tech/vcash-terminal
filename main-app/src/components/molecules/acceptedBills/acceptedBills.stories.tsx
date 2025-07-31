import type { Meta, StoryObj } from '@storybook/react'

import AcceptedBills from './acceptedBills'

const meta: Meta<typeof AcceptedBills> = {
    title: '2. Molecules/Accepted Bills',
    component: AcceptedBills,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#e6ecff' }
            ]
        }
    }
}

export default meta

type Story = StoryObj<typeof AcceptedBills>

export const Default: Story = {}
