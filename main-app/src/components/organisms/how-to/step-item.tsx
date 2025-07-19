import React from 'react'

import { dashLine } from '@/assets/icons'

export type StepItemProps = {
    title: string
    description: string | React.ReactNode
    image: string
    stepIndex: number
}
export default function StepItem({
    title,
    description,
    image,
    stepIndex
}: StepItemProps) {
    return (
        <div className="step-item">
            <div className="index-container">
                <img src={dashLine} alt="dash line" className={'dash-line'} />
                <p className="step-item-index">{stepIndex}</p>
            </div>
            <div className="step-item-image">
                <img src={image} alt={title} />
            </div>
            <h2>{title}</h2>
            <p className="step-item-description ">{description}</p>
            <p className="step-item-description no-margin">{stepIndex == 2 && <span>market.vcash.rs</span>}</p>
        </div>
    )
}
