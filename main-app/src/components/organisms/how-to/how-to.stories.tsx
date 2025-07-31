import type { Meta, StoryObj } from '@storybook/react'

import HowTo from './how-to'

const meta = {
  title: "3. Organisms/How To",
  component: HowTo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HowTo>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        navigate: () => {}
    },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#ddd" }],
    },
  },
}
