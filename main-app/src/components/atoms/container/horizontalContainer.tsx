import React from 'react'

export type HorizontalContainerProps = {
    style?: React.CSSProperties
    gap?: number
    children: React.ReactNode
}
export default function HorizontalContainer({
    style = {},
    gap = 2,
    children
}: HorizontalContainerProps) {
    return (
        <div
            className="horizontal-container"
            style={{ ...(style ?? {}), gap: `${gap}rem` }}>
            {children}
        </div>
    )
}
