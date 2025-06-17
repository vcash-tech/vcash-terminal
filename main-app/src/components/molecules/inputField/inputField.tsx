import 'react-simple-keyboard/build/css/index.css'

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
    const [layoutName, setLayoutName] = useState('default')

    const onChangeValue = (value: string) => {
        onChange(id, value)
        setInputValue(value)
    }

    const onKeyPress = (button: string) => {
        if (button === '{enter}') {
            setIsFocused(false)
            return
        }
        console.log('button', button)

        if (button === '{shift}' || button === '{lock}') {
            handleShiftButton(button)
            return
        }

        if (!['{backspace}', '{tab}'].includes(button)) {
            setInputValue(inputValue + button)
        } else if (button === '{backspace}' && inputValue.length > 0) {
            setInputValue(inputValue.slice(0, -1))
        }
    }

    const handleShiftButton = (_button: string) => {
        const newLayoutName = layoutName === 'default' ? 'shift' : 'default'
        setLayoutName(newLayoutName)
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
                <div className={'keyboard-container'}>
                    <Keyboard
                        layoutName={layoutName}
                        onChange={onChangeValue}
                        onKeyPress={onKeyPress}
                        buttonAttributes={[
                            {
                                attribute: 'aria-label',
                                value: 'Change to uppercase',
                                buttons: '{shift} {lock}'
                            }
                        ]}
                        layout={{
                            default: [
                                '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
                                '{tab} q w e r t y u i o p [ ] \\',
                                "{lock} a s d f g h j k l ; ' {enter}",
                                '{shift} z x c v b n m , . / {shift}',
                                '.com @ {space}'
                            ],
                            shift: [
                                '~ ! @ # $ % ^ & * ( ) _ + {backspace}',
                                '{tab} Q W E R T Y U I O P { } |',
                                '{lock} A S D F G H J K L : " {enter}',
                                '{shift} Z X C V B N M < > ? {shift}',
                                '.com @ {space}'
                            ]
                        }}
                    />
                </div>
            )}
        </div>
    )
}