import type { Meta, StoryObj } from '@storybook/react'

import QrCodeModal from './qrCodeModal'

const meta: Meta<typeof QrCodeModal> = {
    title: '3. Organisms/QR Code Modal',
    component: QrCodeModal,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        qrCode: 'https://via.placeholder.com/150',
        isOpen: true
    }
}
