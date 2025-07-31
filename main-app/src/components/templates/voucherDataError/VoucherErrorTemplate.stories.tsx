import type { Meta, StoryObj } from "@storybook/react"

import VoucherErrorTemplate from "./VoucherErrorTemplate"

const meta = {
  title: "4. Templates/Voucher Data Error",
  component: VoucherErrorTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VoucherErrorTemplate>

export default meta
type Story = StoryObj<typeof meta>;

export const Successful: Story = {
  args: {
    navigate: () => { console.log('Navigating to home') },
    showHelp: false,
    onPrimaryButtonClick: () => {
      console.log(`Navigating to page`)
    },
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#333333" },
      ],
    },
  },
}

export const Failed: Story = {
  args: {
    navigate: () => { },
    showHelp: true,
    onPrimaryButtonClick: () => {},
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#333333" },
      ],
    },
  },
}

