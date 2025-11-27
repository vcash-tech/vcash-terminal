import { useState, useEffect } from 'react'

import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Keyboard from '@/components/molecules/keyboard/keyboard'
import { useTranslate } from '@/i18n/useTranslate'

import './_ipsInputDialog.scss'

type InputType = 'text' | 'numeric' | 'amount'

type IpsInputDialogProps = {
    isOpen: boolean
    title: string
    label: string
    value: string
    type: InputType
    placeholder?: string
    onClose: () => void
    onConfirm: (value: string) => void
    maxLength?: number
    formatValue?: (value: string) => string
}

export default function IpsInputDialog({
    isOpen,
    title,
    label,
    value,
    type,
    placeholder,
    onClose,
    onConfirm,
    maxLength,
    formatValue
}: IpsInputDialogProps) {
    const { t } = useTranslate()
    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
        if (isOpen) {
            setInputValue(value)
        }
    }, [isOpen, value])

    if (!isOpen) return null

    const handleNumericInput = (digit: string) => {
        if (type === 'amount') {
            const currentValue = inputValue
            if (digit === '.' && !currentValue.includes('.')) {
                setInputValue(currentValue + '.')
            } else if (digit !== '.') {
                const parts = currentValue.split('.')
                if (parts.length === 1 || (parts[1] && parts[1].length < 2)) {
                    setInputValue(currentValue + digit)
                }
            }
        } else {
            const currentValue = inputValue.replace(/\D/g, '')
            if (!maxLength || currentValue.length < maxLength) {
                const newValue = currentValue + digit
                setInputValue(newValue)
            }
        }
    }

    const handleBackspace = () => {
        if (inputValue.length > 0) {
            setInputValue(inputValue.slice(0, -1))
        }
    }

    const handleClear = () => {
        setInputValue('')
    }

    const handleConfirm = () => {
        onConfirm(formatValue ? formatValue(inputValue) : inputValue)
        onClose()
    }

    const displayValue = formatValue ? formatValue(inputValue) : inputValue

    return (
        <div className="ips-input-dialog">
            <div className="dialog-overlay" onClick={onClose}></div>
            <div className="dialog-content">
                <h2>{title}</h2>
                <div className="dialog-input-section">
                    <label>{label}</label>
                    <div className="input-display">
                        <input
                            type="text"
                            value={displayValue}
                            placeholder={placeholder}
                            readOnly
                            className="large-input"
                        />
                        {type === 'amount' && (
                            <span className="currency">RSD</span>
                        )}
                    </div>
                </div>

                {type === 'numeric' || type === 'amount' ? (
                    <div className="numeric-keyboard">
                        <div className="keyboard-row">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    className="keyboard-key"
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleNumericInput(num.toString())}>
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div className="keyboard-row">
                            {[4, 5, 6].map((num) => (
                                <button
                                    key={num}
                                    className="keyboard-key"
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleNumericInput(num.toString())}>
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div className="keyboard-row">
                            {[7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    className="keyboard-key"
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleNumericInput(num.toString())}>
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div className="keyboard-row">
                            <button
                                className="keyboard-key backspace"
                                tabIndex={-1}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleBackspace}>
                                ⌫
                            </button>
                            <button
                                className="keyboard-key"
                                tabIndex={-1}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleNumericInput('0')}>
                                0
                            </button>
                            {type === 'amount' ? (
                                <button
                                    className="keyboard-key"
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleNumericInput('.')}>
                                    .
                                </button>
                            ) : (
                                <button
                                    className="keyboard-key clear"
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={handleClear}>
                                    C
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-keyboard-container">
                        <Keyboard
                            value={inputValue}
                            onChange={(newValue) => setInputValue(newValue)}
                            onUpdateFocus={(focused) => {
                                if (!focused) {
                                    // Keep keyboard visible
                                }
                            }}
                        />
                    </div>
                )}

                <div className="dialog-actions">
                    <PrimaryButton
                        text={t('ipsPayment.cancel') || 'Cancel'}
                        callback={onClose}
                        inverted={true}
                    />
                    <PrimaryButton
                        text={t('common.confirm') || 'Confirm'}
                        callback={handleConfirm}
                    />
                </div>
            </div>
        </div>
    )
}
