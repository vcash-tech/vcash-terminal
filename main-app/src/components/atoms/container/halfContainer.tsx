import React from 'react'

export default function HalfContainer({
    children,
    style
}: {
    children: React.ReactNode
    style?: React.CSSProperties
}) {
    return (
        <div className="half-container" style={style}>
            {children}
        </div>
    )
}
