import 'react-simple-keyboard/build/css/index.css'

import { useState } from 'react'
import KeyboardSimple from 'react-simple-keyboard'

export type KeyboardProps = {
    value?: string
    onChangeValue?: (value: string) => void
    onChange?: (value: string) => void
    onUpdateFocus: (value: boolean) => void
}

export default function Keyboard({
    onChangeValue,
    onChange,
    onUpdateFocus,
    value
}: KeyboardProps) {
    const [layoutName, setLayoutName] = useState('default')

    const onKeyPress = (button: string) => {
        if (button === '{enter}') {
            onUpdateFocus(false)
            return
        }

        if (button === '{shift}' || button === '{lock}') {
            handleShiftButton(button)
            return
        }

        if (button === '{space}') {
            handleSpaceButton()
            return
        }

        if (!['{backspace}', '{tab}'].includes(button)) {
            if (onChange) {
                onChange(value + button)
                
                return
            }
        }

        if (button === '{backspace}' && value && value?.length > 0) {
            if (onChange) {
                onChange((value ?? '')?.slice(0, -1))
            }
        }
    }

    const handleShiftButton = (_button: string) => {
        const newLayoutName = layoutName === 'default' ? 'shift' : 'default'
        setLayoutName(newLayoutName)
    }

    const handleSpaceButton = () => {
        if (onChange) {
            onChange(value + ' ')
        }
    }

    return (
        <div className={'keyboard-container'}>
            <KeyboardSimple
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
                    ], shift: [
                        '{lock} a s d f g h j k l ; \' {enter}',
                        '~ ! @ # $ % ^ & * ( ) _ + {backspace}',
                        '{tab} Q W E R T Y U I O P { } |',
                        '{lock} A S D F G H J K L : " {enter}',
                        '{shift} Z X C V B N M < > ? {shift}',
                        '.com @ {space}'
                    ]
                }}
            />
        </div>
    )
}