import { useState, useRef, useEffect, useCallback } from 'react'
import { NavigateFunction } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import Keyboard from '@/components/molecules/keyboard/keyboard'
import { useKeyboard } from '@/context/KeyboardContext'
import { useTranslate } from '@/i18n/useTranslate'

import './_ipsPaymentTemplate.scss'

type IpsPaymentFormData = {
    accountNumber: string
    amount: string
    name: string
    address: string
}

export default function IpsPaymentTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const { isKeyboardVisible, setKeyboardVisible } = useKeyboard()
    const [isScanning, setIsScanning] = useState(false)
    const [isManualInput, setIsManualInput] = useState(false)
    const [activeField, setActiveField] = useState<string | null>(null)
    const [formData, setFormData] = useState<IpsPaymentFormData>({
        accountNumber: '',
        amount: '',
        name: '',
        address: ''
    })

    const abortControllerRef = useRef<AbortController | null>(null)

    // Handle QR scan (mock implementation)
    const handleScan = useCallback((value: string) => {
        // Mock: Parse QR code data and fill form
        // In real implementation, this would parse the QR code data
        console.log('QR Code scanned:', value)
        
        // Mock data from QR code - simulate parsing IPS QR code format
        // In real implementation, this would parse the actual QR code structure
        setFormData({
            accountNumber: '265101061000000001',
            amount: '1500.00',
            name: 'Marko Petrović',
            address: 'Bulevar Kralja Aleksandra 123, Beograd'
        })
        setIsScanning(false)
        setIsManualInput(true) // Show form after scanning
    }, [])

    // Start scanning
    const startScanning = useCallback(() => {
        setIsScanning(true)
        setIsManualInput(false)
        // Mock: In real implementation, this would start the QR scanner
        // For now, simulate a scan after 2 seconds
        setTimeout(() => {
            // Mock scan result
            handleScan('mock-qr-data')
        }, 2000)
    }, [handleScan])

    // Stop scanning
    const stopScanning = useCallback(() => {
        setIsScanning(false)
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }, [])

    // Handle field focus
    const handleFieldFocus = (fieldName: string) => {
        setActiveField(fieldName)
        // Only show full keyboard for text fields (name, address)
        if (fieldName === 'name' || fieldName === 'address') {
            setKeyboardVisible(true)
        } else {
            // For numeric fields, keyboard is shown inline
            setKeyboardVisible(false)
        }
    }

    // Handle field blur
    const handleFieldBlur = () => {
        setActiveField(null)
        setKeyboardVisible(false)
    }

    // Handle input change
    const handleInputChange = (fieldName: keyof IpsPaymentFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    // Handle numeric input (for account number and amount)
    const handleNumericInput = (
        digit: string,
        fieldName: 'accountNumber' | 'amount'
    ) => {
        if (fieldName === 'accountNumber') {
            const currentValue = formData.accountNumber.replace(/\D/g, '')
            // Account number: max 18 digits
            if (currentValue.length < 18) {
                handleInputChange(fieldName, currentValue + digit)
            }
        } else if (fieldName === 'amount') {
            const currentValue = formData.amount
            // Amount: allow decimal point
            if (digit === '.' && !currentValue.includes('.')) {
                handleInputChange(fieldName, currentValue + '.')
            } else if (digit !== '.') {
                // Limit to 2 decimal places
                const parts = currentValue.split('.')
                if (parts.length === 1 || (parts[1] && parts[1].length < 2)) {
                    handleInputChange(fieldName, currentValue + digit)
                }
            }
        }
    }

    // Handle backspace
    const handleBackspace = (fieldName: 'accountNumber' | 'amount') => {
        const currentValue = formData[fieldName]
        if (currentValue.length > 0) {
            handleInputChange(fieldName, currentValue.slice(0, -1))
        }
    }

    // Format account number for display (add leading zeros if needed)
    const formatAccountNumberDisplay = (account: string): string => {
        const digits = account.replace(/\D/g, '')
        if (digits.length === 0) return ''
        // Pad with leading zeros to make it 18 digits for display
        return digits.padStart(18, '0')
    }

    // Format account number for submission (add leading zeros if needed)
    const formatAccountNumber = (account: string): string => {
        const digits = account.replace(/\D/g, '')
        if (digits.length === 0) return ''
        // Pad with leading zeros to make it 18 digits
        return digits.padStart(18, '0')
    }

    // Validate form
    const isFormValid = (): boolean => {
        const accountDigits = formData.accountNumber.replace(/\D/g, '')
        const amountValue = parseFloat(formData.amount)
        
        return (
            accountDigits.length === 18 &&
            !isNaN(amountValue) &&
            amountValue > 0 &&
            formData.name.trim().length > 0 &&
            formData.address.trim().length > 0
        )
    }

    // Handle confirm
    const handleConfirm = () => {
        if (isFormValid()) {
            // Mock: In real implementation, this would submit the payment
            console.log('Payment confirmed:', {
                ...formData,
                accountNumber: formatAccountNumber(formData.accountNumber)
            })
            // Navigate to confirmation or next step
            // navigate('/ips-confirmation')
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopScanning()
        }
    }, [stopScanning])

    return (
        <Container isFullHeight={true}>
            <Header navigateBackUrl={'/welcome-with-services'} navigationBackText={t('header.back')} />
            <div className="ips-payment">
                <h1>{t('ipsPayment.title') || 'IPS Plaćanje'}</h1>
                <h2>{t('ipsPayment.subtitle') || 'Skenirajte QR kod ili unesite podatke ručno'}</h2>

                {!isManualInput && !isScanning && (
                    <div className="ips-payment-actions">
                        <PrimaryButton
                            text={t('ipsPayment.scanQR') || 'Skeniraj QR kod'}
                            callback={startScanning}
                        />
                        <PrimaryButton
                            text={t('ipsPayment.manualInput') || 'Ručni unos'}
                            callback={() => {
                                setIsManualInput(true)
                                setIsScanning(false)
                            }}
                            inverted={true}
                        />
                    </div>
                )}

                {isScanning && (
                    <div className="ips-scanning">
                        <div className="scanning-indicator">
                            <div className="scanning-animation"></div>
                        </div>
                        <p>{t('ipsPayment.scanning') || 'Skeniranje u toku...'}</p>
                        <p className="scanning-hint">
                            {t('ipsPayment.scanningHint') || 'Uperite kameru na QR kod na računu'}
                        </p>
                        <PrimaryButton
                            text={t('ipsPayment.cancel') || 'Otkaži'}
                            callback={stopScanning}
                            inverted={true}
                        />
                    </div>
                )}

                {(isManualInput || formData.accountNumber) && (
                    <div className="ips-payment-form">
                        <div className="form-field">
                            <label>{t('ipsPayment.accountNumber') || 'Broj računa'}</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    value={formatAccountNumberDisplay(formData.accountNumber)}
                                    placeholder="000000000000000000"
                                    maxLength={18}
                                    onFocus={() => handleFieldFocus('accountNumber')}
                                    onBlur={handleFieldBlur}
                                    readOnly
                                    className={activeField === 'accountNumber' ? 'active' : ''}
                                />
                            </div>
                            {activeField === 'accountNumber' && (
                                <div className="numeric-keyboard">
                                    <div className="keyboard-row">
                                        {[1, 2, 3].map((num) => (
                                            <button
                                                key={num}
                                                className="keyboard-key"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleNumericInput(num.toString(), 'accountNumber')}>
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
                                                onClick={() => handleNumericInput(num.toString(), 'accountNumber')}>
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
                                                onClick={() => handleNumericInput(num.toString(), 'accountNumber')}>
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="keyboard-row">
                                        <button
                                            className="keyboard-key backspace"
                                            tabIndex={-1}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleBackspace('accountNumber')}>
                                            ⌫
                                        </button>
                                        <button
                                            className="keyboard-key"
                                            tabIndex={-1}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleNumericInput('0', 'accountNumber')}>
                                            0
                                        </button>
                                        <button
                                            className="keyboard-key clear"
                                            tabIndex={-1}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleInputChange('accountNumber', '')}>
                                            C
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label>{t('ipsPayment.amount') || 'Iznos'}</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    value={formData.amount}
                                    placeholder="0.00"
                                    onFocus={() => handleFieldFocus('amount')}
                                    onBlur={handleFieldBlur}
                                    readOnly
                                    className={activeField === 'amount' ? 'active' : ''}
                                />
                                <span className="currency">RSD</span>
                            </div>
                            {activeField === 'amount' && (
                                <div className="numeric-keyboard">
                                    <div className="keyboard-row">
                                        {[1, 2, 3].map((num) => (
                                            <button
                                                key={num}
                                                className="keyboard-key"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleNumericInput(num.toString(), 'amount')}>
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
                                                onClick={() => handleNumericInput(num.toString(), 'amount')}>
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
                                                onClick={() => handleNumericInput(num.toString(), 'amount')}>
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="keyboard-row">
                                        <button
                                            className="keyboard-key backspace"
                                            tabIndex={-1}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleBackspace('amount')}>
                                            ⌫
                                        </button>
                                        <button
                                            className="keyboard-key"
                                            tabIndex={-1}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleNumericInput('0', 'amount')}>
                                            0
                                        </button>
                                        <button
                                            className="keyboard-key"
                                            tabIndex={-1}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleNumericInput('.', 'amount')}>
                                            .
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label>{t('ipsPayment.name') || 'Ime i prezime'}</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    value={formData.name}
                                    placeholder={t('ipsPayment.namePlaceholder') || 'Unesite ime i prezime'}
                                    onFocus={() => handleFieldFocus('name')}
                                    onBlur={handleFieldBlur}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={activeField === 'name' ? 'active' : ''}
                                />
                            </div>
                            {activeField === 'name' && isKeyboardVisible && (
                                <Keyboard
                                    value={formData.name}
                                    onChange={(value) => handleInputChange('name', value)}
                                    onUpdateFocus={(focused) => {
                                        if (!focused) {
                                            handleFieldBlur()
                                        }
                                    }}
                                />
                            )}
                        </div>

                        <div className="form-field">
                            <label>{t('ipsPayment.address') || 'Adresa'}</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    value={formData.address}
                                    placeholder={t('ipsPayment.addressPlaceholder') || 'Unesite adresu'}
                                    onFocus={() => handleFieldFocus('address')}
                                    onBlur={handleFieldBlur}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className={activeField === 'address' ? 'active' : ''}
                                />
                            </div>
                            {activeField === 'address' && isKeyboardVisible && (
                                <Keyboard
                                    value={formData.address}
                                    onChange={(value) => handleInputChange('address', value)}
                                    onUpdateFocus={(focused) => {
                                        if (!focused) {
                                            handleFieldBlur()
                                        }
                                    }}
                                />
                            )}
                        </div>

                        <div className="form-actions">
                            <PrimaryButton
                                text={t('ipsPayment.confirm') || 'Potvrdi'}
                                callback={handleConfirm}
                                isDisabled={!isFormValid()}
                            />
                            {isManualInput && (
                                <PrimaryButton
                                    text={t('ipsPayment.cancel') || 'Otkaži'}
                                    callback={() => {
                                        setIsManualInput(false)
                                        setFormData({
                                            accountNumber: '',
                                            amount: '',
                                            name: '',
                                            address: ''
                                        })
                                    }}
                                    inverted={true}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </Container>
    )
}
