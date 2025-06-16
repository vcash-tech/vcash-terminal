import React from 'react'

export default function Container({
    children,
    isFullHeight,
    isHorizontal,
    maxWidth,
    style
}: {
    children: React.ReactNode
    isFullHeight?: boolean
    isHorizontal?: boolean
    maxWidth?: string
    style?: React.CSSProperties
}) {
    return (
        <div
            className={`container ${isHorizontal ? 'horizontal' : ''} ${
                isFullHeight ? 'full-height' : ''
            }`}
            style={{ ...(style ?? {}), maxWidth }}>
            {children}
        </div>
    )
}
