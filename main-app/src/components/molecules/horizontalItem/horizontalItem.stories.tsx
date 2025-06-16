import type { Meta, StoryObj } from "@storybook/react"

import HorizontalItem from "./horizontalItem"

const meta = {
  title: "2. Molecules/Horizontal Item",
  component: HorizontalItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HorizontalItem>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "Bill Payments",
        body: "Quickly Scan your bill to pay via barcodes."
    },
}

