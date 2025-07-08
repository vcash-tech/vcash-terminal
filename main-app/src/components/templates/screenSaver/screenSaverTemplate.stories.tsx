import type { Meta, StoryObj } from '@storybook/react'

import ScreenSaverTemplate from './screenSaverTemplate'

const meta = {
    title: '4. Templates/ScreenSaver',
    component: ScreenSaverTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    args: {
        navigate: () => console.log('navigate')
    }
} satisfies Meta<typeof ScreenSaverTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {
    name: 'Inactive State',
    args: {
        isFullScreen: false,
        navigate: () => {}
    }
}

export const Active: Story = {
    name: 'Active State',
    args: {
        isFullScreen: true
    }
}