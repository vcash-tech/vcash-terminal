import type { Meta, StoryObj } from "@storybook/react"
import { BrowserRouter } from "react-router-dom"

import PaymentMethodTerminalTemplate from "./paymentMethodTerminalTemplate"

const meta = {
  title: "4. Templates/Payment Method Terminal",
  component: PaymentMethodTerminalTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentMethodTerminalTemplate>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
      navigate: () => {}
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#333333" },
      ],
    },
  },
  decorators: [
      (Story) => (
          <BrowserRouter>
              <Story />
          </BrowserRouter>
      ),
  ],
}

