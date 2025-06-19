import type { Meta, StoryObj } from '@storybook/react'

import SessionTimeout from './sessionTimeout'



const meta: Meta<typeof SessionTimeout> = {
    title: '3. Organisms/Session Timeout Modal',
    component: SessionTimeout,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        isOpen: true
    }
}
