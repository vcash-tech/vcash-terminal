import type { Meta, StoryObj } from "@storybook/react";
import paymentSuccessfulTemplate from "./paymentSuccessfulTemplate";

const meta = {
  title: "4. Templates/Payment Successful",
  component: paymentSuccessfulTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof paymentSuccessfulTemplate>;

export default meta;
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
};

