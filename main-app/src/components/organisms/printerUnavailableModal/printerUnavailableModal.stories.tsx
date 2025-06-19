import type { Meta, StoryObj } from '@storybook/react'

import PrinterUnavailableModal from './printerUnavailableModal'



const meta: Meta<typeof PrinterUnavailableModal> = {
    title: '3. Organisms/Printer Unavailable Modal',
    component: PrinterUnavailableModal,
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
