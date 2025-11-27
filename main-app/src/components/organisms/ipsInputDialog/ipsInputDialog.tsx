import { useState, useEffect } from 'react'

import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Keyboard from '@/components/molecules/keyboard/keyboard'
import { useTranslate } from '@/i18n/useTranslate'

import './_ipsInputDialog.scss'

type InputType = 'text' | 'numeric' | 'amount' | 'accountNumber'

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

    // Format account number with mask: xxx-xxxxxxxxxxxxx-xx
    const formatAccountNumber = (digits: string): string => {
        const cleanDigits = digits.replace(/\D/g, '')
        
        if (cleanDigits.length === 0) return ''
        if (cleanDigits.length <= 3) {
            // Only first part entered
            return cleanDigits
        }
        
        if (cleanDigits.length <= 5) {
            // First 3 + some middle digits (but we don't know last 2 yet)
            const first3 = cleanDigits.slice(0, 3)
            const middle = cleanDigits.slice(3)
            const middlePadded = middle.padStart(13, '0')
            return `${first3}-${middlePadded}`
        }
        
        // Full format: first 3, middle (padded to 13), last 2
        const first3 = cleanDigits.slice(0, 3)
        const last2 = cleanDigits.slice(-2)
        const middle = cleanDigits.slice(3, -2)
        const middlePadded = middle.padStart(13, '0')
        
        return `${first3}-${middlePadded}-${last2}`
    }

    // Extract raw digits from formatted account number
    const extractAccountDigits = (formatted: string): string => {
        return formatted.replace(/\D/g, '')
    }

    useEffect(() => {
        if (isOpen) {
            if (type === 'accountNumber') {
                // If value is already formatted or raw, extract digits and format
                const digits = value.replace(/\D/g, '')
                setInputValue(formatAccountNumber(digits))
            } else {
                setInputValue(value)
            }
        }
    }, [isOpen, value, type])

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
        } else if (type === 'accountNumber') {
            const currentDigits = extractAccountDigits(inputValue)
            if (currentDigits.length < 18) {
                const newDigits = currentDigits + digit
                setInputValue(formatAccountNumber(newDigits))
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
        if (type === 'accountNumber') {
            const currentDigits = extractAccountDigits(inputValue)
            if (currentDigits.length > 0) {
                const newDigits = currentDigits.slice(0, -1)
                setInputValue(formatAccountNumber(newDigits))
            }
        } else {
            if (inputValue.length > 0) {
                setInputValue(inputValue.slice(0, -1))
            }
        }
    }

    const handleClear = () => {
        setInputValue('')
    }

    const handleConfirm = () => {
        let finalValue = inputValue
        if (type === 'accountNumber') {
            // Return raw 18-digit number (without dashes)
            finalValue = extractAccountDigits(inputValue).padStart(18, '0')
        } else if (formatValue) {
            finalValue = formatValue(inputValue)
        }
        onConfirm(finalValue)
        onClose()
    }

    const displayValue = (() => {
        if (type === 'accountNumber') {
            return formatAccountNumber(extractAccountDigits(inputValue))
        }
        return formatValue ? formatValue(inputValue) : inputValue
    })()

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

                {(type === 'numeric' || type === 'amount' || type === 'accountNumber') ? (
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
