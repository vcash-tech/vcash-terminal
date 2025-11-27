import { useState, useRef, useEffect, useCallback } from 'react'
import { NavigateFunction, useLocation } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import IpsInputDialog from '@/components/organisms/ipsInputDialog/ipsInputDialog'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'
import { VoucherPurchaseStep } from '@/data/enums/voucherPurchaseSteps'

import './_ipsPaymentTemplate.scss'

type IpsPaymentInstruction = {
    id: string
    accountNumber: string
    amount: string
    model: string
    referenceNumber: string
    name: string
    address: string
}

type ViewMode = 'initial' | 'scanning' | 'form' | 'list' | 'summary'
type DialogField = 'accountNumber' | 'amount' | 'model' | 'referenceNumber' | 'name' | 'address' | null

export default function IpsPaymentTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const location = useLocation()
    const { setPaymentMethod, setCurrentStep } = useOrder()
    
    const [viewMode, setViewMode] = useState<ViewMode>('initial')
    const [instructions, setInstructions] = useState<IpsPaymentInstruction[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [dialogField, setDialogField] = useState<DialogField>(null)
    
    const [formData, setFormData] = useState<Omit<IpsPaymentInstruction, 'id'>>({
        accountNumber: '',
        amount: '',
        model: '',
        referenceNumber: '',
        name: '',
        address: ''
    })

    const abortControllerRef = useRef<AbortController | null>(null)

    const generateId = () => `instruction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const handleScan = useCallback((value: string) => {
        console.log('QR Code scanned:', value)
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

    const startScanning = useCallback(() => {
        setIsScanning(true)
        setViewMode('scanning')
        setTimeout(() => {
            handleScan('mock-qr-data')
        }, 2000)
    }, [handleScan])

    const stopScanning = useCallback(() => {
        setIsScanning(false)
        setViewMode('initial')
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }, [])

    const handleInputDialogConfirm = (field: DialogField, value: string) => {
        if (field) {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }))
        }
        setDialogField(null)
    }

    const formatAccountNumberDisplay = (account: string): string => {
        const digits = account.replace(/\D/g, '')
        if (digits.length === 0) return ''
        return digits.padStart(18, '0')
    }

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
            
            setFormData({
                accountNumber: '',
                amount: '',
                model: '',
                referenceNumber: '',
                name: '',
                address: ''
            })
            setViewMode('list')
        }
    }

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
            setViewMode('form')
        }
    }

    const handleDeleteInstruction = (id: string) => {
        setInstructions(prev => prev.filter(inst => inst.id !== id))
    }

    const calculateTotal = (): number => {
        return instructions.reduce((sum, inst) => {
            return sum + (parseFloat(inst.amount) || 0)
        }, 0)
    }

    const handleProceedToPayment = () => {
        if (instructions.length > 0) {
            setViewMode('summary')
        }
    }

    const handleSelectPaymentMethod = () => {
        navigate('/payment-method', {
            state: {
                voucherType: 'ips',
                instructions: instructions,
                totalAmount: calculateTotal()
            }
        })
    }

    useEffect(() => {
        return () => {
            stopScanning()
        }
    }, [stopScanning])

    useEffect(() => {
        if (location.state?.fromPaymentMethod) {
            setViewMode('list')
        }
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
                        <h1>{t('ipsPayment.title')}</h1>
                        <h2>{t('ipsPayment.subtitle')}</h2>
                        <div className="ips-payment-actions">
                            <PrimaryButton
                                text={t('ipsPayment.scanQR')}
                                callback={startScanning}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.manualInput')}
                                callback={() => {
                                    setFormData({
                                        accountNumber: '',
                                        amount: '',
                                        model: '',
                                        referenceNumber: '',
                                        name: '',
                                        address: ''
                                    })
                                    setEditingId(null)
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
                        <p>{t('ipsPayment.scanning')}</p>
                        <p className="scanning-hint">{t('ipsPayment.scanningHint')}</p>
                        <PrimaryButton
                            text={t('ipsPayment.cancel')}
                            callback={stopScanning}
                            inverted={true}
                        />
                    </div>
                )}

                {viewMode === 'form' && (
                    <div className="ips-payment-form">
                        <h2>{editingId ? t('ipsPayment.editInstruction') : t('ipsPayment.addInstruction')}</h2>
                        
                        <div className="form-field">
                            <label>{t('ipsPayment.accountNumber')}</label>
                            <div className="input-container" onClick={() => setDialogField('accountNumber')}>
                                <input
                                    type="text"
                                    value={formatAccountNumberDisplay(formData.accountNumber)}
                                    placeholder="000000000000000000"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>{t('ipsPayment.amount')}</label>
                            <div className="input-container" onClick={() => setDialogField('amount')}>
                                <input
                                    type="text"
                                    value={formData.amount}
                                    placeholder="0.00"
                                    readOnly
                                />
                                <span className="currency">RSD</span>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>{t('ipsPayment.model')}</label>
                                <div className="input-container" onClick={() => setDialogField('model')}>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        placeholder="97"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>{t('ipsPayment.referenceNumber')}</label>
                                <div className="input-container" onClick={() => setDialogField('referenceNumber')}>
                                    <input
                                        type="text"
                                        value={formData.referenceNumber}
                                        placeholder={t('ipsPayment.referencePlaceholder')}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>{t('ipsPayment.name')}</label>
                            <div className="input-container" onClick={() => setDialogField('name')}>
                                <input
                                    type="text"
                                    value={formData.name}
                                    placeholder={t('ipsPayment.namePlaceholder')}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>{t('ipsPayment.address')}</label>
                            <div className="input-container" onClick={() => setDialogField('address')}>
                                <input
                                    type="text"
                                    value={formData.address}
                                    placeholder={t('ipsPayment.addressPlaceholder')}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <PrimaryButton
                                text={editingId ? t('ipsPayment.update') : t('ipsPayment.add')}
                                callback={handleAddInstruction}
                                isDisabled={!isFormValid()}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.cancel')}
                                callback={() => {
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
                        <h1>{t('ipsPayment.instructions')}</h1>
                        <div className="instructions-container">
                            {instructions.map((instruction, index) => (
                                <div key={instruction.id} className="instruction-item">
                                    <span className="instruction-number">{index + 1}.</span>
                                    <span className="instruction-account">{formatAccountNumberDisplay(instruction.accountNumber)}</span>
                                    <span className="instruction-amount">{parseFloat(instruction.amount).toFixed(2)} RSD</span>
                                    <span className="instruction-model">{instruction.model}</span>
                                    <div className="instruction-actions">
                                        <button
                                            className="action-button edit"
                                            onClick={() => handleEditInstruction(instruction.id)}
                                            title={t('ipsPayment.edit')}>
                                            ✏️
                                        </button>
                                        <button
                                            className="action-button delete"
                                            onClick={() => handleDeleteInstruction(instruction.id)}
                                            title={t('ipsPayment.delete')}>
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {instructions.length > 0 && (
                            <div className="list-summary">
                                <div className="summary-row">
                                    <span className="summary-label">{t('ipsPayment.total')}:</span>
                                    <span className="summary-value">{total.toFixed(2)} RSD</span>
                                </div>
                            </div>
                        )}

                        <div className="list-actions">
                            <PrimaryButton
                                text={t('ipsPayment.addAnother')}
                                callback={() => {
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
                                    text={t('ipsPayment.proceed')}
                                    callback={handleProceedToPayment}
                                />
                            )}
                        </div>
                    </div>
                )}

                {viewMode === 'summary' && (
                    <div className="ips-payment-summary">
                        <h1>{t('ipsPayment.summary')}</h1>
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
                                <span className="summary-total-label">{t('ipsPayment.totalAmount')}:</span>
                                <span className="summary-total-value">{total.toFixed(2)} RSD</span>
                            </div>
                        </div>
                        <div className="summary-actions">
                            <PrimaryButton
                                text={t('ipsPayment.back')}
                                callback={() => setViewMode('list')}
                                inverted={true}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.confirmAndPay')}
                                callback={handleSelectPaymentMethod}
                            />
                        </div>
                    </div>
                )}
            </div>
            <Footer />

            {/* Input Dialogs */}
            {dialogField === 'accountNumber' && (
                <IpsInputDialog
                    isOpen={true}
                    title={t('ipsPayment.accountNumber')}
                    label={t('ipsPayment.accountNumber')}
                    value={formData.accountNumber}
                    type="numeric"
                    placeholder="000000000000000000"
                    maxLength={18}
                    formatValue={(val) => formatAccountNumberDisplay(val)}
                    onClose={() => setDialogField(null)}
                    onConfirm={(value) => handleInputDialogConfirm('accountNumber', value)}
                />
            )}

            {dialogField === 'amount' && (
                <IpsInputDialog
                    isOpen={true}
                    title={t('ipsPayment.amount')}
                    label={t('ipsPayment.amount')}
                    value={formData.amount}
                    type="amount"
                    placeholder="0.00"
                    onClose={() => setDialogField(null)}
                    onConfirm={(value) => handleInputDialogConfirm('amount', value)}
                />
            )}

            {dialogField === 'model' && (
                <IpsInputDialog
                    isOpen={true}
                    title={t('ipsPayment.model')}
                    label={t('ipsPayment.model')}
                    value={formData.model}
                    type="numeric"
                    placeholder="97"
                    maxLength={2}
                    onClose={() => setDialogField(null)}
                    onConfirm={(value) => handleInputDialogConfirm('model', value)}
                />
            )}

            {dialogField === 'referenceNumber' && (
                <IpsInputDialog
                    isOpen={true}
                    title={t('ipsPayment.referenceNumber')}
                    label={t('ipsPayment.referenceNumber')}
                    value={formData.referenceNumber}
                    type="numeric"
                    placeholder={t('ipsPayment.referencePlaceholder')}
                    maxLength={20}
                    onClose={() => setDialogField(null)}
                    onConfirm={(value) => handleInputDialogConfirm('referenceNumber', value)}
                />
            )}

            {dialogField === 'name' && (
                <IpsInputDialog
                    isOpen={true}
                    title={t('ipsPayment.name')}
                    label={t('ipsPayment.name')}
                    value={formData.name}
                    type="text"
                    placeholder={t('ipsPayment.namePlaceholder')}
                    onClose={() => setDialogField(null)}
                    onConfirm={(value) => handleInputDialogConfirm('name', value)}
                />
            )}

            {dialogField === 'address' && (
                <IpsInputDialog
                    isOpen={true}
                    title={t('ipsPayment.address')}
                    label={t('ipsPayment.address')}
                    value={formData.address}
                    type="text"
                    placeholder={t('ipsPayment.addressPlaceholder')}
                    onClose={() => setDialogField(null)}
                    onConfirm={(value) => handleInputDialogConfirm('address', value)}
                />
            )}
        </Container>
    )
}
