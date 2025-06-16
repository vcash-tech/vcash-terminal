import type { Meta, StoryObj } from "@storybook/react"

import { cashPayment, creditCardPayment } from "../../../assets/images"
import PaymentCard from "./paymentCard"

const meta = {
  title: "1. Atoms/Payment Card",
  component: PaymentCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentCard>

export default meta
type Story = StoryObj<typeof meta>;

export const CardPayment: Story = {
  args: {
    image: creditCardPayment,
    text: "Card Payment",
    callback: () => console.log("Card payment selected"),
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

export const CashPayment: Story = {
  args: {
    image: cashPayment,
    text: "Cash Payment",
    callback: () => console.log("Cash payment selected"),
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