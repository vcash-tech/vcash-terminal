import React from 'react'

export type WireButtonProps = {
    children: React.ReactNode
    onClick?: () => void
}

export default function WireButton({ children, onClick }: WireButtonProps) {
    return (
        <button className="wire-button" onClick={onClick}>
            {children}
        </button>
    )
}
