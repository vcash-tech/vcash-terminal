import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { scanVoucher } from '@/assets/images'
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
    // Payer info (can be edited by user)
    payerName: string
    payerAddress: string
    // Recipient info (from QR code)
    recipientName: string
    recipientAddress: string
    recipientAccount: string // 18 digits
    // Payment details
    amount: string
    currency: string
    paymentPurpose: string
    paymentCode: string
    model: string
    referenceNumber: string
}

type IPSView = 'scan' | 'manual' | 'review' | 'confirm'

export default function IpsPaymentTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const { startUrl } = useNavigationContext()
    const { state } = useOrder()
    const sessionId = state.sessionId || undefined

    const [currentView, setCurrentView] = useState<IPSView>('scan')
    const [paymentData, setPaymentData] = useState<IPSPaymentData>({
        payerName: '',
        payerAddress: '',
        recipientName: '',
        recipientAddress: '',
        recipientAccount: '',
        amount: '',
        currency: 'RSD',
        paymentPurpose: '',
        paymentCode: '',
        model: '97',
        referenceNumber: ''
    })

    const [activeField, setActiveField] = useState<keyof IPSPaymentData | null>(
        null
    )
    const [isScanning, setIsScanning] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Parse IPS QR code data (simplified mock implementation)
    const parseIPSQRCode = useCallback((qrData: string): IPSPaymentData => {
        // IPS QR codes contain pipe-separated data
        // This is a simplified parser - real implementation would follow NBS IPS spec
        const parts = qrData.split('|')

        // Mock parsing - in reality this would parse the actual IPS format
        return {
            payerName: '',
            payerAddress: '',
            recipientName: parts[5] || 'Primalac',
            recipientAddress: parts[6] || '',
            recipientAccount: parts[7] || '',
            amount: parts[4] || '0',
            currency: 'RSD',
            paymentPurpose: parts[9] || '',
            paymentCode: parts[3] || '189',
            model: parts[10] || '97',
            referenceNumber: parts[11] || ''
        }
    }, [])

    // Handle QR scan
    const handleScan = useCallback(
        (value: string) => {
            if (value) {
                const parsedData = parseIPSQRCode(value)
                setPaymentData(parsedData)
                setCurrentView('review')
                setIsScanning(false)
            }
        },
        [parseIPSQRCode]
    )

    // Start QR scanning
    useEffect(() => {
        if (currentView !== 'scan' || !isScanning) {
            return
        }

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
    }, [currentView, isScanning, handleScan, sessionId])

    // Start scanning when entering scan view
    useEffect(() => {
        if (currentView === 'scan') {
            setIsScanning(true)
        }
    }, [currentView])

    // Handle field input
    const handleFieldChange = (field: keyof IPSPaymentData, value: string) => {
        setPaymentData((prev) => ({ ...prev, [field]: value }))
    }

    // Handle numeric input for amount
    const handleAmountInput = (digit: string) => {
        if (digit === 'backspace') {
            setPaymentData((prev) => ({
                ...prev,
                amount: prev.amount.slice(0, -1)
            }))
        } else if (digit === 'clear') {
            setPaymentData((prev) => ({ ...prev, amount: '' }))
        } else if (digit === '.' || digit === ',') {
            if (!paymentData.amount.includes('.')) {
                setPaymentData((prev) => ({
                    ...prev,
                    amount: prev.amount + '.'
                }))
            }
        } else {
            setPaymentData((prev) => ({
                ...prev,
                amount: prev.amount + digit
            }))
        }
    }

    // Handle numeric input for account number
    const handleAccountInput = (digit: string) => {
        if (digit === 'backspace') {
            setPaymentData((prev) => ({
                ...prev,
                recipientAccount: prev.recipientAccount.slice(0, -1)
            }))
        } else if (digit === 'clear') {
            setPaymentData((prev) => ({ ...prev, recipientAccount: '' }))
        } else if (paymentData.recipientAccount.length < 18) {
            setPaymentData((prev) => ({
                ...prev,
                recipientAccount: prev.recipientAccount + digit
            }))
        }
    }

    // Format account number for display (XXX-XXXXXXXXX-XX)
    const formatAccountNumber = (account: string): string => {
        const digits = account.replace(/\D/g, '')
        if (digits.length <= 3) return digits
        if (digits.length <= 13)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`
        return `${digits.slice(0, 3)}-${digits.slice(3, 13)}-${digits.slice(13, 15)}`
    }

    // Validate account number (simplified mod97 check)
    const isValidAccount = (account: string): boolean => {
        const digits = account.replace(/\D/g, '')
        return digits.length === 18
    }

    // Handle payment confirmation (mock)
    const handleConfirmPayment = () => {
        // This would trigger actual payment processing
        console.log('Processing IPS payment:', paymentData)
        setCurrentView('confirm')
    }

    // Go back
    const handleBack = () => {
        if (currentView === 'review') {
            setCurrentView('scan')
        } else if (currentView === 'manual') {
            setCurrentView('scan')
        } else {
            navigate(startUrl ?? '/welcome')
        }
    }

    // Render scan view
    const renderScanView = () => (
        <div className="ips-scan-view">
            <div className="scan-header">
                <h1>{t('ips.scanTitle')}</h1>
                <p>{t('ips.scanDescription')}</p>
            </div>

            <div className="scan-area">
                <img src={scanVoucher} alt={t('ips.scannerAlt')} />
                <span className="scan-active">{t('ips.scanActive')}</span>
            </div>

            <button
                className="manual-input-button"
                onClick={() => {
                    setIsScanning(false)
                    setCurrentView('manual')
                }}>
                {t('ips.manualInputButton')}
            </button>

            <div className="action-buttons">
                <PrimaryButton
                    text={t('common.cancel')}
                    callback={handleBack}
                />
            </div>
        </div>
    )

    // Render manual input view
    const renderManualInputView = () => (
        <div className="ips-manual-view">
            <div className="manual-header">
                <h1>{t('ips.manualTitle')}</h1>
                <p>{t('ips.manualDescription')}</p>
            </div>

            <div className="form-section">
                <h3>{t('ips.recipientSection')}</h3>

                <div className="input-group">
                    <label>{t('ips.recipientAccount')}</label>
                    <div
                        className={`account-display ${activeField === 'recipientAccount' ? 'active' : ''}`}
                        onClick={() => setActiveField('recipientAccount')}>
                        {formatAccountNumber(paymentData.recipientAccount) ||
                            t('ips.accountPlaceholder')}
                    </div>
                </div>

                <div className="input-group">
                    <label>{t('ips.recipientName')}</label>
                    <input
                        type="text"
                        value={paymentData.recipientName}
                        onChange={(e) =>
                            handleFieldChange('recipientName', e.target.value)
                        }
                        onFocus={() => setActiveField('recipientName')}
                        placeholder={t('ips.recipientNamePlaceholder')}
                    />
                </div>

                <div className="input-group">
                    <label>{t('ips.amount')}</label>
                    <div
                        className={`amount-display ${activeField === 'amount' ? 'active' : ''}`}
                        onClick={() => setActiveField('amount')}>
                        {paymentData.amount || '0'}{' '}
                        <span className="currency">RSD</span>
                    </div>
                </div>

                <div className="input-group">
                    <label>{t('ips.paymentPurpose')}</label>
                    <input
                        type="text"
                        value={paymentData.paymentPurpose}
                        onChange={(e) =>
                            handleFieldChange('paymentPurpose', e.target.value)
                        }
                        onFocus={() => setActiveField('paymentPurpose')}
                        placeholder={t('ips.paymentPurposePlaceholder')}
                    />
                </div>

                <div className="input-row">
                    <div className="input-group half">
                        <label>{t('ips.model')}</label>
                        <input
                            type="text"
                            value={paymentData.model}
                            onChange={(e) =>
                                handleFieldChange('model', e.target.value)
                            }
                            placeholder="97"
                        />
                    </div>
                    <div className="input-group half">
                        <label>{t('ips.referenceNumber')}</label>
                        <input
                            type="text"
                            value={paymentData.referenceNumber}
                            onChange={(e) =>
                                handleFieldChange(
                                    'referenceNumber',
                                    e.target.value
                                )
                            }
                            placeholder={t('ips.referenceNumberPlaceholder')}
                        />
                    </div>
                </div>
            </div>

            {/* Numeric keyboard for account/amount */}
            {(activeField === 'recipientAccount' ||
                activeField === 'amount') && (
                <div className="numeric-keyboard">
                    <div className="keyboard-row">
                        {[1, 2, 3].map((num) => (
                            <button
                                key={num}
                                className="keyboard-key"
                                onClick={() =>
                                    activeField === 'amount'
                                        ? handleAmountInput(num.toString())
                                        : handleAccountInput(num.toString())
                                }>
                                {num}
                            </button>
                        ))}
                    </div>
                    <div className="keyboard-row">
                        {[4, 5, 6].map((num) => (
                            <button
                                key={num}
                                className="keyboard-key"
                                onClick={() =>
                                    activeField === 'amount'
                                        ? handleAmountInput(num.toString())
                                        : handleAccountInput(num.toString())
                                }>
                                {num}
                            </button>
                        ))}
                    </div>
                    <div className="keyboard-row">
                        {[7, 8, 9].map((num) => (
                            <button
                                key={num}
                                className="keyboard-key"
                                onClick={() =>
                                    activeField === 'amount'
                                        ? handleAmountInput(num.toString())
                                        : handleAccountInput(num.toString())
                                }>
                                {num}
                            </button>
                        ))}
                    </div>
                    <div className="keyboard-row">
                        <button
                            className="keyboard-key special"
                            onClick={() =>
                                activeField === 'amount'
                                    ? handleAmountInput('.')
                                    : null
                            }
                            disabled={activeField !== 'amount'}>
                            {activeField === 'amount' ? '.' : ''}
                        </button>
                        <button
                            className="keyboard-key"
                            onClick={() =>
                                activeField === 'amount'
                                    ? handleAmountInput('0')
                                    : handleAccountInput('0')
                            }>
                            0
                        </button>
                        <button
                            className="keyboard-key special backspace"
                            onClick={() =>
                                activeField === 'amount'
                                    ? handleAmountInput('backspace')
                                    : handleAccountInput('backspace')
                            }>
                            ⌫
                        </button>
                    </div>
                </div>
            )}

            <div className="action-buttons">
                <PrimaryButton
                    text={t('ips.reviewPayment')}
                    callback={() => setCurrentView('review')}
                    isDisabled={
                        !paymentData.recipientAccount || !paymentData.amount
                    }
                />
                <button className="secondary-button" onClick={handleBack}>
                    {t('common.cancel')}
                </button>
            </div>
        </div>
    )

    // Render review view
    const renderReviewView = () => (
        <div className="ips-review-view">
            <div className="review-header">
                <h1>{t('ips.reviewTitle')}</h1>
                <p>{t('ips.reviewDescription')}</p>
            </div>

            <div className="payment-summary">
                <div className="summary-section">
                    <h3>{t('ips.paymentDetails')}</h3>

                    <div className="summary-row highlight">
                        <span className="label">{t('ips.amount')}</span>
                        <span className="value amount">
                            {parseFloat(paymentData.amount || '0').toLocaleString(
                                'sr-RS'
                            )}{' '}
                            RSD
                        </span>
                    </div>

                    <div className="summary-row">
                        <span className="label">{t('ips.recipientAccount')}</span>
                        <span className="value">
                            {formatAccountNumber(paymentData.recipientAccount)}
                        </span>
                    </div>

                    {paymentData.recipientName && (
                        <div className="summary-row">
                            <span className="label">{t('ips.recipientName')}</span>
                            <span className="value">
                                {paymentData.recipientName}
                            </span>
                        </div>
                    )}

                    {paymentData.paymentPurpose && (
                        <div className="summary-row">
                            <span className="label">{t('ips.paymentPurpose')}</span>
                            <span className="value">
                                {paymentData.paymentPurpose}
                            </span>
                        </div>
                    )}

                    {paymentData.referenceNumber && (
                        <div className="summary-row">
                            <span className="label">{t('ips.referenceNumber')}</span>
                            <span className="value">
                                {paymentData.model}-{paymentData.referenceNumber}
                            </span>
                        </div>
                    )}
                </div>

                <div className="summary-section editable">
                    <h3>{t('ips.payerSection')}</h3>

                    <div className="input-group">
                        <label>{t('ips.payerName')}</label>
                        <input
                            type="text"
                            value={paymentData.payerName}
                            onChange={(e) =>
                                handleFieldChange('payerName', e.target.value)
                            }
                            placeholder={t('ips.payerNamePlaceholder')}
                        />
                    </div>

                    <div className="input-group">
                        <label>{t('ips.payerAddress')}</label>
                        <input
                            type="text"
                            value={paymentData.payerAddress}
                            onChange={(e) =>
                                handleFieldChange('payerAddress', e.target.value)
                            }
                            placeholder={t('ips.payerAddressPlaceholder')}
                        />
                    </div>
                </div>

                <div className="edit-amount-section">
                    <button
                        className="edit-amount-button"
                        onClick={() => {
                            setActiveField('amount')
                            setCurrentView('manual')
                        }}>
                        {t('ips.editAmount')}
                    </button>
                </div>
            </div>

            <div className="fee-notice">
                <p>{t('ips.feeNotice')}</p>
            </div>

            <div className="action-buttons">
                <PrimaryButton
                    text={t('ips.confirmPayment')}
                    callback={handleConfirmPayment}
                    isDisabled={
                        !isValidAccount(paymentData.recipientAccount) ||
                        !paymentData.amount ||
                        parseFloat(paymentData.amount) <= 0
                    }
                />
                <button className="secondary-button" onClick={handleBack}>
                    {t('common.cancel')}
                </button>
            </div>
        </div>
    )

    // Render confirmation view (success)
    const renderConfirmView = () => (
        <div className="ips-confirm-view">
            <div className="success-icon">
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
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
            <p className="success-subtitle">{t('ips.successDescription')}</p>

            <div className="payment-receipt">
                <div className="receipt-row">
                    <span className="label">{t('ips.amount')}</span>
                    <span className="value">
                        {parseFloat(paymentData.amount || '0').toLocaleString(
                            'sr-RS'
                        )}{' '}
                        RSD
                    </span>
                </div>
                <div className="receipt-row">
                    <span className="label">{t('ips.recipientAccount')}</span>
                    <span className="value">
                        {formatAccountNumber(paymentData.recipientAccount)}
                    </span>
                </div>
                {paymentData.recipientName && (
                    <div className="receipt-row">
                        <span className="label">{t('ips.recipientName')}</span>
                        <span className="value">{paymentData.recipientName}</span>
                    </div>
                )}
            </div>

            <div className="action-buttons">
                <PrimaryButton
                    text={t('ips.newPayment')}
                    callback={() => {
                        setPaymentData({
                            payerName: '',
                            payerAddress: '',
                            recipientName: '',
                            recipientAddress: '',
                            recipientAccount: '',
                            amount: '',
                            currency: 'RSD',
                            paymentPurpose: '',
                            paymentCode: '',
                            model: '97',
                            referenceNumber: ''
                        })
                        setCurrentView('scan')
                    }}
                />
                <button
                    className="secondary-button"
                    onClick={() => navigate(startUrl ?? '/welcome')}>
                    {t('ips.finish')}
                </button>
            </div>
        </div>
    )

    return (
        <Container isFullHeight={true}>
            <Header
                navigationBackText={t('header.back')}
                navigateBackUrl={startUrl ?? '/welcome'}
            />
            <div className="ips-payment">
                {currentView === 'scan' && renderScanView()}
                {currentView === 'manual' && renderManualInputView()}
                {currentView === 'review' && renderReviewView()}
                {currentView === 'confirm' && renderConfirmView()}
            </div>
            <Footer />
        </Container>
    )
}
