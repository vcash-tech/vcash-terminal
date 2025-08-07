import type { Meta, StoryObj } from '@storybook/react'

import AlertModal from './alertModal'



const meta: Meta<typeof AlertModal> = {
    title: '3. Organisms/Alert Modal',
    component: AlertModal,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const AlertOnly: Story = {
    args: {
        title: 'Alert Title',
        message: 'Lorem ipsum sit dolor amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }
}

export const CtaButtonOn: Story = {
    args: {
        title: 'Alert Title',
        message: 'Lorem ipsum sit dolor amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        onCtaClick: () => console.log('Alert closed'),
        ctaText: 'Action button'
    }
}

export const SupportOn: Story = {
    args: {
        title: 'Alert Title',
        message: 'Lorem ipsum sit dolor amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        displaySupport: true
    }
}

export const AllOn: Story = {
    args: {
        title: 'Alert Title',
        message: 'Lorem ipsum sit dolor amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        onCtaClick: () => console.log('Alert closed'),
        ctaText: 'Action button',
        displaySupport: true
    }
}


