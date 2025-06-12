import type { Meta, StoryObj } from "@storybook/react";
import PaymentProcessTemplate from "./paymentProcessTemplate";

const meta = {
  title: "4. Templates/Payment Process",
  component: PaymentProcessTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentProcessTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inverted: Story = {
  args: {
    inverted: true,
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
};
