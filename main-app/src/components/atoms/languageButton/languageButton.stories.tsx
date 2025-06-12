import type { Meta, StoryObj } from "@storybook/react";
import LanguageButton from "./languageButton";
import { flagEN, flagRS } from "../../../assets/icons";

const meta = {
  title: "1. Atoms/Language Button",
  component: LanguageButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LanguageButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RS: Story = {
  args: {
    flag: flagRS,
    language: "RS",
    callback: () => console.log("Language changed to RS"),
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#385AC9" },
      ],
    },
  }
};

export const EN: Story = {
  args: {
    flag: flagEN,
    language: "EN",
    callback: () => console.log("Language changed to EN"),
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#385AC9" },
      ],
    },
  }
};