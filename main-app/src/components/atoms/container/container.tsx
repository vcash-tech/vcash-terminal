import React from 'react'

export default function Container({
    children,
    isFullHeight,
    isHorizontal,
    maxWidth,
    style,
    className
}: {
    children: React.ReactNode
    isFullHeight?: boolean
    isHorizontal?: boolean
    maxWidth?: string
    style?: React.CSSProperties
    className?: string
}) {
    return (
        <div
            className={`container ${isHorizontal ? 'horizontal' : ''} ${
                isFullHeight ? 'full-height' : ''
            } ${className ?? ''}`}
            style={{ ...(style ?? {}), maxWidth }}>
            {children}
        </div>
    )
}
