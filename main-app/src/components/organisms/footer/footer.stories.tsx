import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import Footer from './footer'

const meta = {
  title: '3. Organisms/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#fff' },
      ],
    },
  },
}
