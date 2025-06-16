import type { Meta, StoryObj } from "@storybook/react"

import PeekButton from "./peekButton"

const meta = {
  title: "1. Atoms/Peek Button",
  component: PeekButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PeekButton>

export default meta
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  args: {
    buttonContent: (
      <div>
        <span>Peek Right</span>
      </div>
    ),
    handleClick: () => {},
    side: "right",
  },
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

export const Left: Story = {
  args: {
    buttonContent: (
      <>
        <span>Peek Left</span>
      </>
    ),
    handleClick: () => {},
    side: "left",
  },
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
