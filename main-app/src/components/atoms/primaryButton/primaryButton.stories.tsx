import type { Meta, StoryObj } from "@storybook/react";
import PrimaryButton from "./primaryButton";

const meta = {
  title: "1. Atoms/Primary Button",
  component: PrimaryButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Default Button",
    callback: () => console.log("Button clicked"),
  },
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#333333" },
      ],
    },
  },
};

export const Inverted: Story = {
  args: {
    inverted: true,
    text: "Inverted Button",
    callback: () => console.log("Button clicked"),
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
