import { useEffect, useRef, useState } from 'react'

import Keyboard from '@/components/molecules/keyboard/keyboard'
import { useKeyboard } from '@/context/KeyboardContext'

export type InputProps = {
    id: string
    type?: string
    name?: string | null
    value: string | undefined
    onChange: (_id: string, _value: string) => void
    placeholder?: string
    icon?: string
    autoCorrect?: boolean
    onFocus?: (_isFocused: boolean) => void
}

export default function Input({
    id,
    type = 'text',
    value,
    name = null,
    icon,
    onChange,
    autoCorrect = false,
    onFocus,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { setKeyboardVisible } = useKeyboard()

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isFocused, value])

    useEffect(() => {
        setKeyboardVisible(isFocused)
        return () => {
            setKeyboardVisible(false)
        }
    }, [isFocused, setKeyboardVisible])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                isFocused
            ) {
                setIsFocused(false)
                if (onFocus) {
                    onFocus(false)
                }

                if (inputRef.current) {
                    inputRef.current.blur()
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isFocused, onFocus])

    const handleFocus = () => {
        setIsFocused(true)
        if (onFocus) {
            onFocus(true)
        }
    }

    const handleKeyboardFocusUpdate = (focused: boolean) => {
        setIsFocused(focused)
        if(onFocus){
            onFocus(focused)
        }

        if (!focused && inputRef.current) {
            inputRef.current.blur()
        }
    }

    return (
        <div className={'input-field-container'} ref={containerRef}>
            {icon && (
                <img
                    src={icon}
                    alt={`${id}-icon`}
                    className={`icon ${id}-icon`}
                />
            )}
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value || ''}
                name={name ?? id}
                {...props}
                autoCorrect={autoCorrect ? 'on' : 'off'}
                className={`input-field ${isFocused ? 'focused' : ''}`}
                onFocus={handleFocus}
                onChange={(e) => onChange(id, e.target.value)}
            />

            {isFocused && (
                <Keyboard
                    onUpdateFocus={handleKeyboardFocusUpdate}
                    value={value || ''}
                    onChange={(keyboardValue) => {
                        onChange(id, keyboardValue)
                    }}
                />
            )}
        </div>
    )
}