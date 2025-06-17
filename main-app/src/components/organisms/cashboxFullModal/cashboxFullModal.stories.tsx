import type { Meta, StoryObj } from '@storybook/react'

import CashboxFullModal from './cashboxFullModal'



const meta: Meta<typeof CashboxFullModal> = {
    title: '3. Organisms/Cashbox Full Modal',
    component: CashboxFullModal,
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
