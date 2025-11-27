import { useState, useRef, useEffect, useCallback } from 'react'
import { NavigateFunction, useLocation } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import Keyboard from '@/components/molecules/keyboard/keyboard'
import { useKeyboard } from '@/context/KeyboardContext'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'
import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'

import './_ipsPaymentTemplate.scss'

type IpsPaymentInstruction = {
    id: string
    accountNumber: string
    amount: string
    model: string // 2-digit model code
    referenceNumber: string // poziv na broj
    name: string
    address: string
}

type ViewMode = 'initial' | 'scanning' | 'form' | 'list' | 'summary'

export default function IpsPaymentTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const location = useLocation()
    const { isKeyboardVisible, setKeyboardVisible } = useKeyboard()
    const { setPaymentMethod, setCurrentStep } = useOrder()
    
    const [viewMode, setViewMode] = useState<ViewMode>('initial')
    const [instructions, setInstructions] = useState<IpsPaymentInstruction[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [isManualInput, setIsManualInput] = useState(false)
    const [activeField, setActiveField] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    
    const [formData, setFormData] = useState<Omit<IpsPaymentInstruction, 'id'>>({
        accountNumber: '',
        amount: '',
        model: '',
        referenceNumber: '',
        name: '',
        address: ''
    })

    const abortControllerRef = useRef<AbortController | null>(null)

    // Generate unique ID for instruction
    const generateId = () => `instruction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Handle QR scan (mock implementation)
    const handleScan = useCallback((value: string) => {
        console.log('QR Code scanned:', value)
        
        // Mock data from QR code
        const newInstruction: IpsPaymentInstruction = {
            id: generateId(),
            accountNumber: '265101061000000001',
            amount: '1500.00',
            model: '97',
            referenceNumber: '12345678901234567890',
            name: 'Marko Petrović',
            address: 'Bulevar Kralja Aleksandra 123, Beograd'
        }
        
        setInstructions(prev => [...prev, newInstruction])
        setIsScanning(false)
        setViewMode('list')
    }, [])

    // Start scanning
    const startScanning = useCallback(() => {
        setIsScanning(true)
        setViewMode('scanning')
        // Mock: simulate scan after 2 seconds
        setTimeout(() => {
            handleScan('mock-qr-data')
        }, 2000)
    }, [handleScan])

    // Stop scanning
    const stopScanning = useCallback(() => {
        setIsScanning(false)
        setViewMode('initial')
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }, [])

    // Handle field focus
    const handleFieldFocus = (fieldName: string) => {
        setActiveField(fieldName)
        if (fieldName === 'name' || fieldName === 'address') {
            setKeyboardVisible(true)
        } else {
            setKeyboardVisible(false)
        }
    }

    // Handle field blur
    const handleFieldBlur = () => {
        setActiveField(null)
        setKeyboardVisible(false)
    }

    // Handle input change
    const handleInputChange = (fieldName: keyof Omit<IpsPaymentInstruction, 'id'>, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    // Handle numeric input
    const handleNumericInput = (
        digit: string,
        fieldName: 'accountNumber' | 'amount' | 'model' | 'referenceNumber'
    ) => {
        if (fieldName === 'accountNumber') {
            const currentValue = formData.accountNumber.replace(/\D/g, '')
            if (currentValue.length < 18) {
                handleInputChange(fieldName, currentValue + digit)
            }
        } else if (fieldName === 'amount') {
            const currentValue = formData.amount
            if (digit === '.' && !currentValue.includes('.')) {
                handleInputChange(fieldName, currentValue + '.')
            } else if (digit !== '.') {
                const parts = currentValue.split('.')
                if (parts.length === 1 || (parts[1] && parts[1].length < 2)) {
                    handleInputChange(fieldName, currentValue + digit)
                }
            }
        } else if (fieldName === 'model') {
            const currentValue = formData.model.replace(/\D/g, '')
            if (currentValue.length < 2) {
                handleInputChange(fieldName, currentValue + digit)
            }
        } else if (fieldName === 'referenceNumber') {
            const currentValue = formData.referenceNumber.replace(/\D/g, '')
            if (currentValue.length < 20) {
                handleInputChange(fieldName, currentValue + digit)
            }
        }
    }

    // Handle backspace
    const handleBackspace = (fieldName: 'accountNumber' | 'amount' | 'model' | 'referenceNumber') => {
        const currentValue = formData[fieldName]
        if (currentValue.length > 0) {
            handleInputChange(fieldName, currentValue.slice(0, -1))
        }
    }

    // Format account number for display
    const formatAccountNumberDisplay = (account: string): string => {
        const digits = account.replace(/\D/g, '')
        if (digits.length === 0) return ''
        return digits.padStart(18, '0')
    }

    // Validate form
    const isFormValid = (): boolean => {
        const accountDigits = formData.accountNumber.replace(/\D/g, '')
        const amountValue = parseFloat(formData.amount)
        const modelDigits = formData.model.replace(/\D/g, '')
        
        return (
            accountDigits.length === 18 &&
            !isNaN(amountValue) &&
            amountValue > 0 &&
            modelDigits.length === 2 &&
            formData.name.trim().length > 0 &&
            formData.address.trim().length > 0
        )
    }

    // Add instruction from form
    const handleAddInstruction = () => {
        if (isFormValid()) {
            const newInstruction: IpsPaymentInstruction = {
                id: editingId || generateId(),
                ...formData,
                accountNumber: formData.accountNumber.replace(/\D/g, '').padStart(18, '0')
            }
            
            if (editingId) {
                setInstructions(prev => 
                    prev.map(inst => inst.id === editingId ? newInstruction : inst)
                )
                setEditingId(null)
            } else {
                setInstructions(prev => [...prev, newInstruction])
            }
            
            // Reset form
            setFormData({
                accountNumber: '',
                amount: '',
                model: '',
                referenceNumber: '',
                name: '',
                address: ''
            })
            setIsManualInput(false)
            setViewMode('list')
        }
    }

    // Edit instruction
    const handleEditInstruction = (id: string) => {
        const instruction = instructions.find(inst => inst.id === id)
        if (instruction) {
            setFormData({
                accountNumber: instruction.accountNumber,
                amount: instruction.amount,
                model: instruction.model,
                referenceNumber: instruction.referenceNumber,
                name: instruction.name,
                address: instruction.address
            })
            setEditingId(id)
            setIsManualInput(true)
            setViewMode('form')
        }
    }

    // Delete instruction
    const handleDeleteInstruction = (id: string) => {
        setInstructions(prev => prev.filter(inst => inst.id !== id))
    }

    // Calculate total
    const calculateTotal = (): number => {
        return instructions.reduce((sum, inst) => {
            return sum + (parseFloat(inst.amount) || 0)
        }, 0)
    }

    // Show summary and proceed to payment method
    const handleProceedToPayment = () => {
        if (instructions.length > 0) {
            setViewMode('summary')
        }
    }

    // Navigate to payment method selection
    const handleSelectPaymentMethod = () => {
        // Store instructions in location state or context
        navigate('/payment-method', {
            state: {
                voucherType: 'ips',
                instructions: instructions,
                totalAmount: calculateTotal()
            }
        })
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopScanning()
        }
    }, [stopScanning])

    // Handle back from payment method page
    useEffect(() => {
        if (location.state?.fromPaymentMethod) {
            setViewMode('list')
        }
        // If we have instructions in state, show list view
        if (location.state?.instructions && location.state.instructions.length > 0) {
            setInstructions(location.state.instructions)
            setViewMode('list')
        }
    }, [location.state])

    const total = calculateTotal()

    return (
        <Container isFullHeight={true}>
            <Header 
                navigateBackUrl={'/welcome-with-services'} 
                navigationBackText={t('header.back')} 
            />
            <div className="ips-payment">
                {viewMode === 'initial' && (
                    <>
                        <h1>{t('ipsPayment.title') || 'IPS Plaćanje'}</h1>
                        <h2>{t('ipsPayment.subtitle') || 'Skenirajte QR kod ili unesite podatke ručno'}</h2>
                        <div className="ips-payment-actions">
                            <PrimaryButton
                                text={t('ipsPayment.scanQR') || 'Skeniraj QR kod'}
                                callback={startScanning}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.manualInput') || 'Ručni unos'}
                                callback={() => {
                                    setIsManualInput(true)
                                    setViewMode('form')
                                }}
                                inverted={true}
                            />
                        </div>
                    </>
                )}

                {viewMode === 'scanning' && (
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

                {viewMode === 'form' && (
                    <div className="ips-payment-form">
                        <h2>{editingId ? t('ipsPayment.editInstruction') || 'Izmeni nalog' : t('ipsPayment.addInstruction') || 'Dodaj nalog'}</h2>
                        
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

                        <div className="form-row">
                            <div className="form-field">
                                <label>{t('ipsPayment.model') || 'Model'}</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        value={formData.model}
                                        placeholder="97"
                                        maxLength={2}
                                        onFocus={() => handleFieldFocus('model')}
                                        onBlur={handleFieldBlur}
                                        readOnly
                                        className={activeField === 'model' ? 'active' : ''}
                                    />
                                </div>
                                {activeField === 'model' && (
                                    <div className="numeric-keyboard compact">
                                        <div className="keyboard-row">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                                                <button
                                                    key={num}
                                                    className="keyboard-key"
                                                    tabIndex={-1}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => handleNumericInput(num.toString(), 'model')}>
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="keyboard-row">
                                            <button
                                                className="keyboard-key backspace"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleBackspace('model')}>
                                                ⌫
                                            </button>
                                            <button
                                                className="keyboard-key clear"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleInputChange('model', '')}>
                                                C
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-field">
                                <label>{t('ipsPayment.referenceNumber') || 'Poziv na broj'}</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        value={formData.referenceNumber}
                                        placeholder={t('ipsPayment.referencePlaceholder') || 'Unesite poziv na broj'}
                                        maxLength={20}
                                        onFocus={() => handleFieldFocus('referenceNumber')}
                                        onBlur={handleFieldBlur}
                                        readOnly
                                        className={activeField === 'referenceNumber' ? 'active' : ''}
                                    />
                                </div>
                                {activeField === 'referenceNumber' && (
                                    <div className="numeric-keyboard">
                                        <div className="keyboard-row">
                                            {[1, 2, 3].map((num) => (
                                                <button
                                                    key={num}
                                                    className="keyboard-key"
                                                    tabIndex={-1}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => handleNumericInput(num.toString(), 'referenceNumber')}>
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
                                                    onClick={() => handleNumericInput(num.toString(), 'referenceNumber')}>
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
                                                    onClick={() => handleNumericInput(num.toString(), 'referenceNumber')}>
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="keyboard-row">
                                            <button
                                                className="keyboard-key backspace"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleBackspace('referenceNumber')}>
                                                ⌫
                                            </button>
                                            <button
                                                className="keyboard-key"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleNumericInput('0', 'referenceNumber')}>
                                                0
                                            </button>
                                            <button
                                                className="keyboard-key clear"
                                                tabIndex={-1}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleInputChange('referenceNumber', '')}>
                                                C
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                                text={editingId ? (t('ipsPayment.update') || 'Ažuriraj') : (t('ipsPayment.add') || 'Dodaj')}
                                callback={handleAddInstruction}
                                isDisabled={!isFormValid()}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.cancel') || 'Otkaži'}
                                callback={() => {
                                    setIsManualInput(false)
                                    setEditingId(null)
                                    setFormData({
                                        accountNumber: '',
                                        amount: '',
                                        model: '',
                                        referenceNumber: '',
                                        name: '',
                                        address: ''
                                    })
                                    setViewMode(instructions.length > 0 ? 'list' : 'initial')
                                }}
                                inverted={true}
                            />
                        </div>
                    </div>
                )}

                {viewMode === 'list' && (
                    <div className="ips-payment-list">
                        <h1>{t('ipsPayment.instructions') || 'Nalozi za plaćanje'}</h1>
                        <div className="instructions-container">
                            {instructions.map((instruction, index) => (
                                <div key={instruction.id} className="instruction-card">
                                    <div className="instruction-header">
                                        <span className="instruction-number">{index + 1}</span>
                                        <div className="instruction-actions">
                                            <button
                                                className="action-button edit"
                                                onClick={() => handleEditInstruction(instruction.id)}
                                                title={t('ipsPayment.edit') || 'Izmeni'}>
                                                ✏️
                                            </button>
                                            <button
                                                className="action-button delete"
                                                onClick={() => handleDeleteInstruction(instruction.id)}
                                                title={t('ipsPayment.delete') || 'Obriši'}>
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div className="instruction-details">
                                        <div className="detail-row">
                                            <span className="detail-label">{t('ipsPayment.accountNumber') || 'Račun'}:</span>
                                            <span className="detail-value">{formatAccountNumberDisplay(instruction.accountNumber)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">{t('ipsPayment.amount') || 'Iznos'}:</span>
                                            <span className="detail-value amount">{parseFloat(instruction.amount).toFixed(2)} RSD</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">{t('ipsPayment.model') || 'Model'}:</span>
                                            <span className="detail-value">{instruction.model}</span>
                                        </div>
                                        {instruction.referenceNumber && (
                                            <div className="detail-row">
                                                <span className="detail-label">{t('ipsPayment.referenceNumber') || 'Poziv na broj'}:</span>
                                                <span className="detail-value">{instruction.referenceNumber}</span>
                                            </div>
                                        )}
                                        <div className="detail-row">
                                            <span className="detail-label">{t('ipsPayment.name') || 'Ime'}:</span>
                                            <span className="detail-value">{instruction.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {instructions.length > 0 && (
                            <div className="list-summary">
                                <div className="summary-row">
                                    <span className="summary-label">{t('ipsPayment.total') || 'Ukupno'}:</span>
                                    <span className="summary-value">{total.toFixed(2)} RSD</span>
                                </div>
                            </div>
                        )}

                        <div className="list-actions">
                            <PrimaryButton
                                text={t('ipsPayment.addAnother') || 'Dodaj još jedan nalog'}
                                callback={() => {
                                    setIsManualInput(true)
                                    setEditingId(null)
                                    setFormData({
                                        accountNumber: '',
                                        amount: '',
                                        model: '',
                                        referenceNumber: '',
                                        name: '',
                                        address: ''
                                    })
                                    setViewMode('form')
                                }}
                                inverted={true}
                            />
                            {instructions.length > 0 && (
                                <PrimaryButton
                                    text={t('ipsPayment.proceed') || 'Nastavi na plaćanje'}
                                    callback={handleProceedToPayment}
                                />
                            )}
                        </div>
                    </div>
                )}

                {viewMode === 'summary' && (
                    <div className="ips-payment-summary">
                        <h1>{t('ipsPayment.summary') || 'Pregled naloga'}</h1>
                        <div className="summary-instructions">
                            {instructions.map((instruction, index) => (
                                <div key={instruction.id} className="summary-instruction">
                                    <div className="summary-instruction-header">
                                        <span className="summary-instruction-number">{index + 1}</span>
                                        <span className="summary-instruction-amount">
                                            {parseFloat(instruction.amount).toFixed(2)} RSD
                                        </span>
                                    </div>
                                    <div className="summary-instruction-details">
                                        <div>{formatAccountNumberDisplay(instruction.accountNumber)}</div>
                                        <div>{instruction.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <div className="summary-total-row">
                                <span className="summary-total-label">{t('ipsPayment.totalAmount') || 'Ukupan iznos'}:</span>
                                <span className="summary-total-value">{total.toFixed(2)} RSD</span>
                            </div>
                        </div>
                        <div className="summary-actions">
                            <PrimaryButton
                                text={t('ipsPayment.back') || 'Nazad'}
                                callback={() => setViewMode('list')}
                                inverted={true}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.confirmAndPay') || 'Potvrdi i plati'}
                                callback={handleSelectPaymentMethod}
                            />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </Container>
    )
}
