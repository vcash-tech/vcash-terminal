import { useState } from 'react'
import Keyboard from 'react-simple-keyboard'

interface InputFieldProps {
    placeholder?: string
    onChange: (id: string, value: string) => void
    id: string
    value?: string
    disableAutofill?: boolean
}

export default function InputField({
    placeholder,
    onChange,
    id,
    value,
    disableAutofill = false
}: InputFieldProps) {
    const [inputValue, setInputValue] = useState(value || '')
    const [isFocused, setIsFocused] = useState(false)

    const onChangeValue = (value: string) => {
        onChange(id, value)
        setInputValue(value)
    }

    return (
        <div className={'input-field'}>
            <input
                id={id}
                type="text"
                placeholder={placeholder ?? ''}
                defaultValue={inputValue}
                onFocus={() => setIsFocused(true)}
                onChange={(event) => onChange(id, event.target.value)}
                autoComplete={disableAutofill ? 'off' : undefined}
                autoCorrect={disableAutofill ? 'off' : undefined}
            />
            {isFocused && (
                <Keyboard
                    onChange={onChangeValue}
                    onUpdateFocus={setIsFocused}
                />
            )}
        </div>
    )
}