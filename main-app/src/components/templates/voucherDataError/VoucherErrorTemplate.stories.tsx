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

export const Default: Story = {
  args: {
    navigate: () => { console.log('Navigating to home') },
    onTryAgain: () => {
      console.log(`Navigating to page`)
    },
    voucherRecreateAttempts: 0
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

