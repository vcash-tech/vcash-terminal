import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import RegisterTemplate from '@/components/templates/register/registerTemplate'
import { DeviceTokenSteps } from '@/data/enums/deviceTokenSteps'

const meta = {
    title: '4. Templates/Register',
    component: RegisterTemplate,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
} satisfies Meta<typeof RegisterTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        navigate: () => {},
        onRegister: () => {},
        deviceName: 'Test Device',
        stepper: DeviceTokenSteps.getCode,
        onChangeDeviceName: () => {},
        onChangeAgentEmail: () => {},
        agentEmail: '',
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#333333' }]
        }
    }
}
