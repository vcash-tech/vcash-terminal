import type { Meta, StoryObj } from "@storybook/react"

import { bettingServices } from "../../../assets/images"
import HomeItem from "./homeItem"

const meta = {
  title: "2. Molecules/Home Item",
  component: HomeItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HomeItem>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "DigitalService List Item",
        image: bettingServices,
        body: "For Sports betting, Casino top-ups and others Betting Services."
    },
}

