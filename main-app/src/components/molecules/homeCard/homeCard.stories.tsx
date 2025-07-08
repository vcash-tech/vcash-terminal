import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import HomeCard from './homeCard'
import { ProductCardType } from './productCardType'

const meta: Meta<typeof HomeCard> = {
  title: 'Molecules/HomeCard',
  component: HomeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: Object.values(ProductCardType).filter(value => typeof value === 'string'),
      description: 'Type of card to display'
    },
    onClick: { action: 'clicked' }
  },
}

export default meta
type Story = StoryObj<typeof HomeCard>

export const Soccer: Story = {
  args: {
    type: ProductCardType.socker,
    onClick: action('Soccer card clicked')
  },
}

export const Basketball: Story = {
  args: {
    type: ProductCardType.basketball,
    onClick: action('Basketball card clicked')
  },
}

export const Casino: Story = {
  args: {
    type: ProductCardType.casino,
    onClick: action('Casino card clicked')
  },
}

export const PlayStation: Story = {
  args: {
    type: ProductCardType.playstation,
    onClick: action('PlayStation card clicked')
  },
}

export const Xbox: Story = {
  args: {
    type: ProductCardType.xbox,
    onClick: action('Xbox card clicked')
  },
}

export const Steam: Story = {
  args: {
    type: ProductCardType.steam,
    onClick: action('Steam card clicked')
  },
}
