import type { Meta, StoryObj } from '@storybook/react'

import ServiceListItem from '@/components/molecules/serviceListItem/serviceListItem'
import { services } from '@/data/mocks/digitalService.mock'

import HorizontalList from './horizontalList'

const meta = {
    title: '3. Organisms/Horizontal List',
    component: HorizontalList,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof HorizontalList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        title: 'Horizontal List',
        list: [
            <ServiceListItem service={services.gamingServices[0]} />,
            <ServiceListItem service={services.gamingServices[1]} />,
            <ServiceListItem service={services.gamingServices[2]} />
        ]
    }
}
