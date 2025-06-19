import { ReactNode } from 'react'

import { useKeyboard } from '@/context/KeyboardContext'

type FormContainerProps = {
    children: ReactNode
    className?: string
}

export default function FormContainer({
    children,
    className = ''
}: FormContainerProps) {
    const { isKeyboardVisible } = useKeyboard()

    return (
        <div
            className={`form-container ${isKeyboardVisible ? 'keyboard-visible' : ''} ${className}`}>
            {children}
        </div>
    )
}
