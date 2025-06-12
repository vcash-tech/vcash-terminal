import type { Meta, StoryObj } from "@storybook/react";
import PaymentFailedOptions from "./paymentFailedOptions";

const meta = {
  title: "2.Molecules/Payment Failed Options",
  component: PaymentFailedOptions,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentFailedOptions>;

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
