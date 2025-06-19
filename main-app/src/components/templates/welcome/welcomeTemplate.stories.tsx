import type { Meta, StoryObj } from "@storybook/react"

import Welcome from "./welcomeTemplate"

const meta = {
  title: "4. Templates/Welcome",
  component: Welcome,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Welcome>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {}

export const Inverted: Story = {
  args: {
    navigate: () => {},
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
}
