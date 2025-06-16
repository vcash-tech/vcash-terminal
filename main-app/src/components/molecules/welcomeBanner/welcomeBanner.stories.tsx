import type { Meta, StoryObj } from "@storybook/react"

import WelcomeBanner from "./welcomeBanner"

const meta = {
  title: "2. Molecules/Welcome Banner",
  component: WelcomeBanner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WelcomeBanner>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {}

export const Inverted: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#333333" },
      ],
    },
  },
}
