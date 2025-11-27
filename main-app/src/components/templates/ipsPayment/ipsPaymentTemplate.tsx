import { useCallback, useEffect, useRef, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { cash, creditCard, scanVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useNavigationContext } from '@/hooks/useNavigationHook'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'
import { apiService } from '@/services/apiService'

// IPS QR Code data structure based on Serbian IPS standard
export interface IPSPaymentData {
    id: string
    payerName: string
    payerAddress: string
    recipientName: string
    recipientAddress: string
    recipientAccount: string
    amount: string
    currency: string
    paymentPurpose: string
    paymentCode: string
    model: string
    referenceNumber: string
}

type IPSView = 'list' | 'add' | 'edit' | 'summary' | 'payment-method' | 'success'
type EditingField = 'amount' | 'recipientAccount' | 'referenceNumber' | null

const createEmptyPayment = (): IPSPaymentData => ({
    id: Date.now().toString(),
    payerName: '',
    payerAddress: '',
    recipientName: '',
    recipientAddress: '',
    recipientAccount: '',
    amount: '',
    currency: 'RSD',
    paymentPurpose: '',
    paymentCode: '289',
    model: '97',
    referenceNumber: ''
})

export default function IpsPaymentTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const { startUrl } = useNavigationContext()
    const { state, setPaymentMethod } = useOrder()
    const sessionId = state.sessionId || undefined

    const [currentView, setCurrentView] = useState<IPSView>('list')
    const [payments, setPayments] = useState<IPSPaymentData[]>([])
    const [currentPayment, setCurrentPayment] = useState<IPSPaymentData>(createEmptyPayment())
    const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
    const [editingField, setEditingField] = useState<EditingField>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [payerName, setPayerName] = useState('')
    const [payerAddress, setPayerAddress] = useState('')

    const abortControllerRef = useRef<AbortController | null>(null)

    // Service fee calculation (mock - 50 RSD per payment)
    const SERVICE_FEE_PER_PAYMENT = 50

    // Calculate totals
    const totalAmount = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    const totalFees = payments.length * SERVICE_FEE_PER_PAYMENT
    const grandTotal = totalAmount + totalFees

    // Parse IPS QR code data
    const parseIPSQRCode = useCallback((qrData: string): Partial<IPSPaymentData> => {
        // IPS QR codes use specific format - this is simplified
        const parts = qrData.split('|')
        return {
            recipientName: parts[5] || '',
            recipientAddress: parts[6] || '',
            recipientAccount: parts[7] || '',
            amount: parts[4] || '',
            paymentPurpose: parts[9] || '',
            paymentCode: parts[3] || '289',
            model: parts[10] || '97',
            referenceNumber: parts[11] || ''
        }
    }, [])

    // Handle QR scan result
    const handleScan = useCallback(
        (value: string) => {
            if (value) {
                const parsedData = parseIPSQRCode(value)
                const newPayment: IPSPaymentData = {
                    ...createEmptyPayment(),
                    ...parsedData,
                    payerName,
                    payerAddress
                }
                setPayments((prev) => [...prev, newPayment])
                setIsScanning(false)
                setCurrentView('list')
            }
        },
        [parseIPSQRCode, payerName, payerAddress]
    )

    // Start QR scanning
    useEffect(() => {
        if (!isScanning) return

        const startScanning = async () => {
            try {
                abortControllerRef.current = new AbortController()
                const value = await apiService.startQrScanner(
                    abortControllerRef.current.signal,
                    sessionId
                )
                handleScan(value || '')
            } catch (e) {
                console.log('IPS Scanner error:', e)
                setIsScanning(false)
            }
        }

        startScanning()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
                abortControllerRef.current = null
            }
            apiService.stopQrScanner(sessionId)
        }
    }, [isScanning, handleScan, sessionId])

    // Format account number for display (XXX-XXXXXXXXXXX-XX)
    const formatAccountNumber = (account: string): string => {
        const digits = account.replace(/\D/g, '')
        if (digits.length <= 3) return digits
        if (digits.length <= 13) return `${digits.slice(0, 3)}-${digits.slice(3)}`
        return `${digits.slice(0, 3)}-${digits.slice(3, 13)}-${digits.slice(13, 15)}`
    }

    // Format currency
    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Handle keyboard input
    const handleKeyPress = (key: string) => {
        if (!editingField) return

        setCurrentPayment((prev) => {
            const currentValue = prev[editingField] || ''
            
            if (key === 'backspace') {
                return { ...prev, [editingField]: currentValue.slice(0, -1) }
            }
            if (key === 'clear') {
                return { ...prev, [editingField]: '' }
            }
            if (key === '.' && editingField === 'amount') {
                if (!currentValue.includes('.')) {
                    return { ...prev, [editingField]: currentValue + '.' }
                }
                return prev
            }
            
            // Limit account number to 18 digits
            if (editingField === 'recipientAccount' && currentValue.replace(/\D/g, '').length >= 18) {
                return prev
            }
            
            return { ...prev, [editingField]: currentValue + key }
        })
    }

    // Add current payment to list
    const addPayment = () => {
        if (currentPayment.recipientAccount && currentPayment.amount) {
            const paymentToAdd = {
                ...currentPayment,
                payerName,
                payerAddress
            }
            
            if (editingPaymentId) {
                setPayments((prev) =>
                    prev.map((p) => (p.id === editingPaymentId ? paymentToAdd : p))
                )
                setEditingPaymentId(null)
            } else {
                setPayments((prev) => [...prev, paymentToAdd])
            }
            
            setCurrentPayment(createEmptyPayment())
            setEditingField(null)
            setCurrentView('list')
        }
    }

    // Edit payment
    const editPayment = (payment: IPSPaymentData) => {
        setCurrentPayment(payment)
        setEditingPaymentId(payment.id)
        setCurrentView('edit')
    }

    // Remove payment
    const removePayment = (id: string) => {
        setPayments((prev) => prev.filter((p) => p.id !== id))
    }

    // Handle payment method selection
    const handlePaymentMethodSelect = (method: 'cash' | 'card') => {
        setPaymentMethod(method)
        // In a real implementation, this would process the payment
        // For now, just show success
        setCurrentView('success')
    }

    // Go back handler
    const handleBack = () => {
        if (currentView === 'add' || currentView === 'edit') {
            setCurrentPayment(createEmptyPayment())
            setEditingPaymentId(null)
            setEditingField(null)
            setCurrentView('list')
        } else if (currentView === 'summary') {
            setCurrentView('list')
        } else if (currentView === 'payment-method') {
            setCurrentView('summary')
        } else {
            navigate(startUrl ?? '/welcome')
        }
    }

    // Render numeric keyboard
    const renderKeyboard = () => (
        <div className="ips-keyboard">
            <div className="keyboard-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        className="key"
                        onClick={() => handleKeyPress(num.toString())}>
                        {num}
                    </button>
                ))}
                <button
                    className="key special"
                    onClick={() => handleKeyPress('.')}
                    disabled={editingField !== 'amount'}>
                    {editingField === 'amount' ? '.' : ''}
                </button>
                <button className="key" onClick={() => handleKeyPress('0')}>
                    0
                </button>
                <button
                    className="key special backspace"
                    onClick={() => handleKeyPress('backspace')}>
                    ⌫
                </button>
            </div>
        </div>
    )

    // Render list view (main view)
    const renderListView = () => (
        <div className="ips-list-view">
            <div className="list-header">
                <h1>{t('ips.title')}</h1>
                <p>{t('ips.subtitle')}</p>
            </div>

            {payments.length > 0 && (
                <div className="payments-list">
                    {payments.map((payment, index) => (
                        <div key={payment.id} className="payment-item">
                            <div className="payment-number">{index + 1}</div>
                            <div className="payment-details">
                                <div className="payment-recipient">
                                    {payment.recipientName || formatAccountNumber(payment.recipientAccount)}
                                </div>
                                <div className="payment-purpose">
                                    {payment.paymentPurpose || t('ips.noDescription')}
                                </div>
                            </div>
                            <div className="payment-amount">
                                {formatCurrency(parseFloat(payment.amount) || 0)} <span>RSD</span>
                            </div>
                            <div className="payment-actions">
                                <button className="edit-btn" onClick={() => editPayment(payment)}>
                                    ✎
                                </button>
                                <button className="remove-btn" onClick={() => removePayment(payment.id)}>
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="add-payment-buttons">
                <button
                    className="add-button scan"
                    onClick={() => {
                        setIsScanning(true)
                        setCurrentView('add')
                    }}>
                    <div className="button-icon">📷</div>
                    <div className="button-text">
                        <span className="button-title">{t('ips.scanQR')}</span>
                        <span className="button-subtitle">{t('ips.scanQRDesc')}</span>
                    </div>
                </button>
                <button
                    className="add-button manual"
                    onClick={() => {
                        setCurrentPayment(createEmptyPayment())
                        setCurrentView('add')
                        setEditingField('recipientAccount')
                    }}>
                    <div className="button-icon">✍</div>
                    <div className="button-text">
                        <span className="button-title">{t('ips.manualEntry')}</span>
                        <span className="button-subtitle">{t('ips.manualEntryDesc')}</span>
                    </div>
                </button>
            </div>

            {payments.length > 0 && (
                <div className="list-summary">
                    <div className="summary-row">
                        <span>{t('ips.paymentsCount', { count: payments.length })}</span>
                        <span className="total">{formatCurrency(totalAmount)} RSD</span>
                    </div>
                    <PrimaryButton
                        text={t('ips.continue')}
                        callback={() => setCurrentView('summary')}
                    />
                </div>
            )}

            {payments.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>{t('ips.emptyState')}</p>
                </div>
            )}
        </div>
    )

    // Render add/edit view
    const renderAddEditView = () => (
        <div className="ips-add-view">
            {isScanning ? (
                <div className="scan-container">
                    <h2>{t('ips.scanTitle')}</h2>
                    <div className="scan-area">
                        <img src={scanVoucher} alt={t('ips.scannerAlt')} />
                        <div className="scan-indicator">
                            <span className="pulse"></span>
                            {t('ips.scanActive')}
                        </div>
                    </div>
                    <button
                        className="switch-to-manual"
                        onClick={() => {
                            setIsScanning(false)
                            setEditingField('recipientAccount')
                        }}>
                        {t('ips.switchToManual')}
                    </button>
                </div>
            ) : (
                <div className="form-container">
                    <h2>{editingPaymentId ? t('ips.editPayment') : t('ips.addPayment')}</h2>
                    
                    <div className="form-fields">
                        <div
                            className={`field ${editingField === 'recipientAccount' ? 'active' : ''}`}
                            onClick={() => setEditingField('recipientAccount')}>
                            <label>{t('ips.recipientAccount')}</label>
                            <div className="field-value account">
                                {formatAccountNumber(currentPayment.recipientAccount) || (
                                    <span className="placeholder">{t('ips.accountPlaceholder')}</span>
                                )}
                            </div>
                        </div>

                        <div
                            className={`field ${editingField === 'amount' ? 'active' : ''}`}
                            onClick={() => setEditingField('amount')}>
                            <label>{t('ips.amount')}</label>
                            <div className="field-value amount">
                                {currentPayment.amount || '0'}
                                <span className="currency">RSD</span>
                            </div>
                        </div>

                        <div
                            className={`field ${editingField === 'referenceNumber' ? 'active' : ''}`}
                            onClick={() => setEditingField('referenceNumber')}>
                            <label>{t('ips.referenceNumber')}</label>
                            <div className="field-value">
                                <span className="model">{currentPayment.model}-</span>
                                {currentPayment.referenceNumber || (
                                    <span className="placeholder">{t('ips.optional')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <PrimaryButton
                            text={editingPaymentId ? t('ips.saveChanges') : t('ips.addToList')}
                            callback={addPayment}
                            isDisabled={!currentPayment.recipientAccount || !currentPayment.amount}
                        />
                    </div>
                </div>
            )}

            {!isScanning && renderKeyboard()}
        </div>
    )

    // Render summary view
    const renderSummaryView = () => (
        <div className="ips-summary-view">
            <h1>{t('ips.summaryTitle')}</h1>
            
            <div className="summary-card">
                <div className="payer-section">
                    <h3>{t('ips.payerInfo')}</h3>
                    <div className="payer-fields">
                        <div className="payer-field">
                            <label>{t('ips.payerName')}</label>
                            <input
                                type="text"
                                value={payerName}
                                onChange={(e) => setPayerName(e.target.value)}
                                placeholder={t('ips.payerNamePlaceholder')}
                            />
                        </div>
                        <div className="payer-field">
                            <label>{t('ips.payerAddress')}</label>
                            <input
                                type="text"
                                value={payerAddress}
                                onChange={(e) => setPayerAddress(e.target.value)}
                                placeholder={t('ips.payerAddressPlaceholder')}
                            />
                        </div>
                    </div>
                </div>

                <div className="payments-summary">
                    <h3>{t('ips.paymentsSummary')}</h3>
                    {payments.map((payment, index) => (
                        <div key={payment.id} className="summary-item">
                            <div className="item-info">
                                <span className="item-number">{index + 1}.</span>
                                <span className="item-name">
                                    {payment.recipientName || formatAccountNumber(payment.recipientAccount)}
                                </span>
                            </div>
                            <span className="item-amount">
                                {formatCurrency(parseFloat(payment.amount) || 0)} RSD
                            </span>
                        </div>
                    ))}
                </div>

                <div className="totals-section">
                    <div className="total-row">
                        <span>{t('ips.subtotal')}</span>
                        <span>{formatCurrency(totalAmount)} RSD</span>
                    </div>
                    <div className="total-row fees">
                        <span>{t('ips.serviceFee')} ({payments.length}x {SERVICE_FEE_PER_PAYMENT} RSD)</span>
                        <span>{formatCurrency(totalFees)} RSD</span>
                    </div>
                    <div className="total-row grand-total">
                        <span>{t('ips.totalToPay')}</span>
                        <span>{formatCurrency(grandTotal)} RSD</span>
                    </div>
                </div>
            </div>

            <div className="summary-actions">
                <PrimaryButton
                    text={t('ips.proceedToPayment')}
                    callback={() => setCurrentView('payment-method')}
                />
                <button className="edit-payments-btn" onClick={() => setCurrentView('list')}>
                    {t('ips.editPayments')}
                </button>
            </div>
        </div>
    )

    // Render payment method selection
    const renderPaymentMethodView = () => (
        <div className="ips-payment-method-view">
            <h1>{t('selectPaymentMethod.title')}</h1>
            <p className="total-display">
                {t('ips.totalToPay')}: <strong>{formatCurrency(grandTotal)} RSD</strong>
            </p>

            <div className="payment-options">
                <button
                    className="payment-option cash"
                    onClick={() => handlePaymentMethodSelect('cash')}>
                    <img src={cash} alt={t('selectPaymentMethod.cashPayment')} />
                    <span>{t('selectPaymentMethod.cashPayment')}</span>
                </button>
                <button
                    className="payment-option card"
                    onClick={() => handlePaymentMethodSelect('card')}>
                    <img src={creditCard} alt={t('selectPaymentMethod.cardPayment')} />
                    <span>{t('selectPaymentMethod.cardPayment')}</span>
                </button>
            </div>
        </div>
    )

    // Render success view
    const renderSuccessView = () => (
        <div className="ips-success-view">
            <div className="success-icon">
                <svg viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="60" fill="#0AAD59" />
                    <path
                        d="M35 60L52 77L85 44"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <h1>{t('ips.successTitle')}</h1>
            <p>{t('ips.successDescription')}</p>

            <div className="success-summary">
                <div className="success-row">
                    <span>{t('ips.paymentsProcessed')}</span>
                    <span>{payments.length}</span>
                </div>
                <div className="success-row total">
                    <span>{t('ips.totalPaid')}</span>
                    <span>{formatCurrency(grandTotal)} RSD</span>
                </div>
            </div>

            <div className="success-actions">
                <PrimaryButton
                    text={t('ips.newPayment')}
                    callback={() => {
                        setPayments([])
                        setCurrentPayment(createEmptyPayment())
                        setCurrentView('list')
                    }}
                />
                <button
                    className="finish-btn"
                    onClick={() => navigate(startUrl ?? '/welcome')}>
                    {t('ips.finish')}
                </button>
            </div>
        </div>
    )

    // Determine back URL based on current view
    const getBackUrl = () => {
        if (currentView === 'list') return startUrl ?? '/welcome'
        return undefined
    }

    return (
        <Container isFullHeight={true}>
            <Header
                navigationBackText={t('header.back')}
                navigateBackUrl={getBackUrl()}
                {...(currentView !== 'list' && { 
                    navigateBackUrl: undefined 
                })}
            />
            <div className="ips-payment">
                {currentView !== 'list' && currentView !== 'success' && (
                    <button className="back-button" onClick={handleBack}>
                        ← {t('header.back')}
                    </button>
                )}
                
                {currentView === 'list' && renderListView()}
                {(currentView === 'add' || currentView === 'edit') && renderAddEditView()}
                {currentView === 'summary' && renderSummaryView()}
                {currentView === 'payment-method' && renderPaymentMethodView()}
                {currentView === 'success' && renderSuccessView()}
            </div>
            <Footer />
        </Container>
    )
}
