
import type { Meta, StoryObj } from "@storybook/react"

import { warningIcon } from "@/assets/icons"

import IconHeading from "./iconHeading"

const meta = {
  title: "1. Atoms/Icon Heading",
  component: IconHeading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconHeading>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: warningIcon,
    heading: "Warning heading",
  },
  parameters: {
    backgrounds: {
      default: "main",
      values: [
        { name: "main", value: "#e6ecff" },
      ],
    },
  }
}