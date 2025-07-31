import type { Meta, StoryObj } from "@storybook/react"

import PaymentSuccessfulTemplate from "./paymentSuccessfulTemplate"

const meta = {
  title: "4. Templates/Payment Successful",
  component: PaymentSuccessfulTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentSuccessfulTemplate>

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

export const InProgress: Story = {
  args: {
    navigate: () => { },
    showHelp: null,
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

