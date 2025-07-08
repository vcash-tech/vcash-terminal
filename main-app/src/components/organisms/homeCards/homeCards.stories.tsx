import type { Meta, StoryObj } from '@storybook/react'

import HomeCards from './homeCards'

const meta = {
  title: "3. Organisms/Home Cards",
  component: HomeCards,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HomeCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onTap: () => console.log('Card tapped')
  },
}

export const FullScreen: Story = {
  args: {
    onTap: () => console.log('Card tapped in full screen')
  },
  parameters: {
    layout: "fullscreen",
  },
}
