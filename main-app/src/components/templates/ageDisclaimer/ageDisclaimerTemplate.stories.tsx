import type { Meta, StoryObj } from "@storybook/react";
import AgeDisclaimerTemplate from "./ageDisclaimerTemplate";

const meta = {
  title: "4. Templates/Age Disclaimer",
  component: AgeDisclaimerTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AgeDisclaimerTemplate>;

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

