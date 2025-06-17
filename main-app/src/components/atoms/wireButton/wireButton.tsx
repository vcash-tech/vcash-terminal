import React from 'react'

export type WireButtonProps = {
    children: React.ReactNode
    isDisabled?: boolean
    onClick?: () => void
}

export default function WireButton({ children, isDisabled=false, onClick }: WireButtonProps) {
    return (
        <button className="wire-button" disabled={isDisabled} onClick={onClick}>
            {children}
        </button>
    )
}
