import type { Meta, StoryObj } from "@storybook/react"

import GeneratingProgress from "./generatingProgress"

const meta = {
  title: "1. Atoms/Generating Progress",
  component: GeneratingProgress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GeneratingProgress>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    progress: 32,
    text: "Generating voucher...",
  },
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#E6ECFF" },
      ],
    },
  }
}
