import React from 'react'

export default function FlexWrapper({
    children,
    isHorizontal = true,
    gap = 20,
    justify = 'flex-start'
}: {
    children: React.ReactNode
    isHorizontal?: boolean
    gap?: number
    justify?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
}) {
    return (
        <div
            className={`flex-wrapper ${isHorizontal ? 'horizontal' : ''}`}
            style={{ gap: `${gap}px`, justifyContent: justify }}>
            {children}
        </div>
    )
}
