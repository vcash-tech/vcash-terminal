import { action } from '@storybook/addon-actions'
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
        navigate: action('navigate')
    }
} satisfies Meta<typeof ScreenSaverTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {
    name: 'Inactive State',
    args: {
        isFullScreen: false
    }
}

export const Active: Story = {
    name: 'Active State',
    args: {
        isFullScreen: true
    }
}