import type { Meta, StoryObj } from "@storybook/react"

import LinkBackButton from "./linkBackButton"

const meta = {
  title: "1. Atoms/Link Back Button",
  component: LinkBackButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LinkBackButton>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttonText: "Back to Link",
    buttonUrl: "#",
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#385AC9" },
      ],
    },
  }
}