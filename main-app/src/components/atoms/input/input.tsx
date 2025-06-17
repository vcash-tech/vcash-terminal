import { useState } from 'react'

import Keyboard from '@/components/molecules/keyboard/keyboard'

export type InputProps = {
    id: string
    type?: string
    name?: string | null
    value: string | undefined
    onChange: (_id: string, _value: string) => void
    placeholder?: string
    icon?: string
    autoCorrect?: boolean
}

export default function Input({
    id,
    type = 'text',
    value,
    name = null,
    icon,
    onChange,
    autoCorrect = false,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className={'input-field-container'}>
            {icon && (
                <img
                    src={icon}
                    alt={`${id}-icon`}
                    className={`icon ${id}-icon`}
                />
            )}
            <input
                id={id}
                type={type}
                defaultValue={value}
                name={name ?? id}
                {...props}
                autoCorrect={autoCorrect ? 'on' : 'off'}
                className={'input-field'}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => onChange(id, e.target.value)}
            />

            {isFocused && (
                <Keyboard
                    onUpdateFocus={setIsFocused}
                    value={value}
                    onChange={(keyboardValue) => {
                        onChange(id, keyboardValue)
                    }}
                />
            )}
        </div>
    )
}