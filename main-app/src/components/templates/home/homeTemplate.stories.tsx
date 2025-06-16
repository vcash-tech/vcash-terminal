import type { Meta, StoryObj } from "@storybook/react"

import HomeTemplate from "./homeTemplate"

const meta = {
  title: "4. Templates/Home",
  component: HomeTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HomeTemplate>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#333333" },
      ],
    },
  },
}

