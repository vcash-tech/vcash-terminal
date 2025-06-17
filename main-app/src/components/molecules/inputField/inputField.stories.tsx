import type { Meta, StoryObj } from '@storybook/react'

import InputField from './inputField'

const meta = {
    title: '2. Molecules/InputField',
    component: InputField,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        id: 'default',
        onChange: () => {},
        value: '',
        placeholder: 'Email address'
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#333333' }]
        }
    }
}
