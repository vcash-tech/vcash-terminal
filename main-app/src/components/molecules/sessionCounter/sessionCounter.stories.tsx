import type { Meta, StoryObj } from '@storybook/react'

import SessionCounter from './sessionCounter'



const meta: Meta<typeof SessionCounter> = {
    title: '3. Organisms/Session Counter',
    component: SessionCounter,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
