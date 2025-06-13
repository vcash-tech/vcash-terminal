import type { Meta, StoryObj } from "@storybook/react";
import WelcomeScreen from "./welcomeScreen";

const meta = {
  title: "3. Organisms/Welcome Screen",
  component: WelcomeScreen,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WelcomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000" }],
    },
  },
};
