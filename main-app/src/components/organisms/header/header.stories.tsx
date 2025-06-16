import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import Header from './header'

const meta = {
  title: '3. Organisms/Header',
  component: Header,
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
} satisfies Meta<typeof Header>

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

export const WithNavigaitonBack: Story = {
  args: {
    navigationBackText: 'Back to Services',
    navigateBackUrl: '/',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#fff' },
      ],
    },
  },
}
