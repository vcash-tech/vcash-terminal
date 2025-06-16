import type { Meta, StoryObj } from "@storybook/react"

import DigitalService from '@/data/entities/digitalService'

import { hbo } from "../../../assets/images"
import ServiceListItem from "./serviceListItem"

const meta = {
  title: "2. Molecules/DigitalService List Item",
  component: ServiceListItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ServiceListItem>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        service: {
            name: "DigitalService List Item",
            image: hbo,
        } as DigitalService
    },
}

