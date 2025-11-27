import { useCallback, useEffect, useRef, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { cash, creditCard } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useNavigationContext } from '@/hooks/useNavigationHook'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'
import { apiService } from '@/services/apiService'

// Bill data structure from IPS QR scan
interface ScannedBill {
    id: string
    recipient: string
    accountNumber: string
    referenceNumber: string
    purpose: string
    originalAmount: number
    amount: number // Editable amount
    model: string
}

type ModalType = 'none' | 'success' | 'error' | 'cash' | 'recap'

// Commission rate (2%)
const COMMISSION_RATE = 0.02

export default function IpsPaymentTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const { startUrl } = useNavigationContext()
    const { state, setPaymentMethod } = useOrder()
    const sessionId = state.sessionId || undefined

    // Bills state
    const [bills, setBills] = useState<ScannedBill[]>([])
    const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
    const [editAmount, setEditAmount] = useState<string>('')
    
    // Scanning state
    const [isScanning, setIsScanning] = useState(true)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Modal state
    const [modalType, setModalType] = useState<ModalType>('none')
    const [modalMessage, setModalMessage] = useState('')

    // Cash payment state
    const [cashInserted, setCashInserted] = useState(0)

    // Get selected bill
    const selectedBill = bills.find(b => b.id === selectedBillId) || null

    // Calculate totals
    const totalBillAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
    const totalCommission = totalBillAmount * COMMISSION_RATE
    const finalAmount = totalBillAmount + totalCommission

    // Format currency
    const formatRSD = (num: number): string => {
        return num.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Parse IPS QR code
    const parseIPSQRCode = useCallback((qrData: string): Omit<ScannedBill, 'id'> => {
        // IPS QR format parsing (simplified)
        const parts = qrData.split('|')
        const amount = parseFloat(parts[4]) || Math.floor(Math.random() * 5000) + 500
        return {
            recipient: parts[5] || ['Infostan Beograd', 'Telekom Srbija', 'EPS Snabdevanje', 'Parking Servis'][Math.floor(Math.random() * 4)],
            accountNumber: parts[7] || `840-${Math.random().toString().slice(2, 15)}-05`,
            referenceNumber: parts[11] || `97 ${Math.floor(Math.random() * 100)}-${Math.random().toString().slice(2, 12)}`,
            purpose: parts[9] || 'Komunalne usluge',
            originalAmount: amount,
            amount: amount,
            model: parts[10] || '97'
        }
    }, [])

    // Handle successful scan
    const handleScan = useCallback((value: string) => {
        if (value) {
            const billData = parseIPSQRCode(value)
            const newBill: ScannedBill = {
                id: Date.now().toString(),
                ...billData
            }
            setBills(prev => [...prev, newBill])
            setSelectedBillId(newBill.id)
            setEditAmount(newBill.amount.toFixed(2))
            
            // Show success briefly
            setModalMessage(t('ips.scanSuccess', { recipient: newBill.recipient }))
            setModalType('success')
            setTimeout(() => setModalType('none'), 2000)
        }
    }, [parseIPSQRCode, t])

    // Start/restart scanning
    const startScanning = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        
        setIsScanning(true)
        
        try {
            abortControllerRef.current = new AbortController()
            const value = await apiService.startQrScanner(
                abortControllerRef.current.signal,
                sessionId
            )
            handleScan(value || '')
            // Continue scanning for more bills
            startScanning()
        } catch (e) {
            console.log('Scanner stopped or error:', e)
            setIsScanning(false)
        }
    }, [handleScan, sessionId])

    // Start scanning on mount
    useEffect(() => {
        startScanning()
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            apiService.stopQrScanner(sessionId)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Select a bill
    const selectBill = (id: string) => {
        setSelectedBillId(id)
        const bill = bills.find(b => b.id === id)
        if (bill) {
            setEditAmount(bill.amount.toFixed(2))
        }
    }

    // Remove a bill
    const removeBill = (id: string) => {
        setBills(prev => prev.filter(b => b.id !== id))
        if (selectedBillId === id) {
            setSelectedBillId(null)
            setEditAmount('')
        }
    }

    // Save edited amount
    const saveAmount = () => {
        if (!selectedBill) return
        
        const newAmount = parseFloat(editAmount)
        if (isNaN(newAmount) || newAmount < selectedBill.originalAmount) {
            setModalMessage(t('ips.amountTooLow'))
            setModalType('error')
            return
        }

        setBills(prev => prev.map(b => 
            b.id === selectedBillId ? { ...b, amount: newAmount } : b
        ))
        
        setModalMessage(t('ips.amountSaved'))
        setModalType('success')
        setTimeout(() => setModalType('none'), 1500)
    }

    // Open cash payment modal
    const openCashModal = () => {
        setCashInserted(0)
        setModalType('cash')
    }

    // Insert cash (simulation)
    const insertCash = (amount: number) => {
        setCashInserted(prev => prev + amount)
    }

    // Complete cash payment
    const completeCashPayment = () => {
        if (cashInserted >= finalAmount) {
            setModalType('recap')
        }
    }

    // Process card payment
    const processCardPayment = () => {
        setPaymentMethod('card')
        setModalType('recap')
    }

    // Finish and reset
    const finishPayment = () => {
        setModalType('none')
        setBills([])
        setSelectedBillId(null)
        setCashInserted(0)
        navigate(startUrl ?? '/welcome')
    }

    // Reset/cancel
    const resetAll = () => {
        setBills([])
        setSelectedBillId(null)
        setCashInserted(0)
        setModalType('none')
        navigate(startUrl ?? '/welcome')
    }

    // Cash remaining calculation
    const cashRemaining = finalAmount - cashInserted
    const hasSurplus = cashRemaining < 0

    return (
        <Container isFullHeight={true} className="ips-container">
            <Header
                navigationBackText={t('header.back')}
                navigateBackUrl={startUrl ?? '/welcome'}
            />
            
            <div className="ips-payment-screen">
                {/* Header Section */}
                <div className="ips-header">
                    <h1>{t('ips.title')}</h1>
                    <p>{t('ips.headerSubtitle')}</p>
                </div>

                {/* Main Content */}
                <div className="ips-main">
                    {/* Bills List Section */}
                    <div className="bills-section">
                        <h2 className="section-title">
                            {t('ips.scannedBills')} <span className="count">({bills.length})</span>
                        </h2>

                        {bills.length === 0 ? (
                            <div className="scanning-prompt">
                                <div className="scan-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4m0 0h3M4 4l.113.113M17 4h3m0 0v3m0-3l-.113.113M4 17v3m0 0h3M4 20l.113-.113M17 20h3m0 0v-3m0 3l-.113-.113M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                    </svg>
                                </div>
                                <p className="prompt-text">{t('ips.scanPrompt')}</p>
                                <p className="prompt-subtext">{t('ips.scanPromptSub')}</p>
                                {isScanning && (
                                    <div className="scanning-indicator">
                                        <span className="pulse"></span>
                                        {t('ips.scannerActive')}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bills-list">
                                {bills.map(bill => (
                                    <div 
                                        key={bill.id}
                                        className={`bill-item ${selectedBillId === bill.id ? 'selected' : ''}`}
                                        onClick={() => selectBill(bill.id)}
                                    >
                                        <div className="bill-info">
                                            <span className="bill-recipient">{bill.recipient}</span>
                                            <span className="bill-reference">{t('ips.refNumber')}: {bill.referenceNumber}</span>
                                        </div>
                                        <div className="bill-amount-section">
                                            <span className="bill-amount">{formatRSD(bill.amount)} RSD</span>
                                            {bill.amount !== bill.originalAmount && (
                                                <span className="amount-modified">{t('ips.modified')}</span>
                                            )}
                                        </div>
                                        <button 
                                            className="remove-btn"
                                            onClick={(e) => { e.stopPropagation(); removeBill(bill.id) }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                
                                {isScanning && (
                                    <div className="scanning-indicator inline">
                                        <span className="pulse"></span>
                                        {t('ips.scanMore')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bill Details Section */}
                    <div className="details-section">
                        <h2 className="section-title">{t('ips.detailsTitle')}</h2>
                        
                        {!selectedBill ? (
                            <div className="details-prompt">
                                <p>{t('ips.selectBillPrompt')}</p>
                            </div>
                        ) : (
                            <div className="bill-details">
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">{t('ips.recipient')}:</span>
                                        <span className="detail-value">{selectedBill.recipient}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">{t('ips.account')}:</span>
                                        <span className="detail-value mono">{selectedBill.accountNumber}</span>
                                    </div>
                                    <div className="detail-item full">
                                        <span className="detail-label">{t('ips.reference')}:</span>
                                        <span className="detail-value mono">{selectedBill.referenceNumber}</span>
                                    </div>
                                    <div className="detail-item full">
                                        <span className="detail-label">{t('ips.purpose')}:</span>
                                        <span className="detail-value">{selectedBill.purpose}</span>
                                    </div>
                                </div>

                                <div className="amount-edit">
                                    <label>{t('ips.amountLabel')} (RSD):</label>
                                    <div className="amount-input-wrapper">
                                        <input
                                            type="number"
                                            value={editAmount}
                                            onChange={(e) => setEditAmount(e.target.value)}
                                            min={selectedBill.originalAmount}
                                            step="0.01"
                                        />
                                        <button 
                                            className="save-btn"
                                            onClick={saveAmount}
                                            disabled={parseFloat(editAmount) === selectedBill.amount}
                                        >
                                            {t('ips.saveAmount')}
                                        </button>
                                    </div>
                                    {parseFloat(editAmount) < selectedBill.originalAmount && (
                                        <p className="amount-error">{t('ips.amountMinError')}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="summary-section">
                    <h2 className="section-title">{t('ips.summaryTitle')}</h2>
                    
                    <div className="summary-card">
                        <div className="summary-row">
                            <span>{t('ips.totalBills')}:</span>
                            <span className="value">{formatRSD(totalBillAmount)} RSD</span>
                        </div>
                        <div className="summary-row commission">
                            <span>{t('ips.commission')} (2%):</span>
                            <span className="value">{formatRSD(totalCommission)} RSD</span>
                        </div>
                        <div className="summary-row total">
                            <span>{t('ips.totalToPay')}:</span>
                            <span className="value">{formatRSD(finalAmount)} RSD</span>
                        </div>
                    </div>

                    {/* Payment Buttons */}
                    <div className="payment-section">
                        <h3>{t('ips.paymentMethod')}</h3>
                        <div className="payment-buttons">
                            <button 
                                className="payment-btn cash"
                                onClick={openCashModal}
                                disabled={bills.length === 0}
                            >
                                <img src={cash} alt="" />
                                <span>{t('selectPaymentMethod.cashPayment')}</span>
                            </button>
                            <button 
                                className="payment-btn card"
                                onClick={processCardPayment}
                                disabled={bills.length === 0}
                            >
                                <img src={creditCard} alt="" />
                                <span>{t('selectPaymentMethod.cardPayment')}</span>
                            </button>
                        </div>
                        <button className="cancel-btn" onClick={resetAll}>
                            {t('ips.cancelTransaction')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success/Error Modal */}
            {(modalType === 'success' || modalType === 'error') && (
                <div className="ips-modal-overlay">
                    <div className={`ips-modal simple ${modalType}`}>
                        <h3>{modalType === 'success' ? t('ips.success') : t('ips.error')}</h3>
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalType('none')}>
                            {t('common.confirm')}
                        </button>
                    </div>
                </div>
            )}

            {/* Cash Payment Modal */}
            {modalType === 'cash' && (
                <div className="ips-modal-overlay">
                    <div className="ips-modal cash-modal">
                        <h3>{t('ips.cashPayment')}</h3>
                        
                        <div className="cash-warning">
                            <strong>{t('ips.importantWarning')}</strong>
                            <p>{t('ips.noChangeWarning')}</p>
                        </div>

                        <div className="cash-summary">
                            <div className="cash-row">
                                <span>{t('ips.totalDue')}:</span>
                                <span className="due">{formatRSD(finalAmount)} RSD</span>
                            </div>
                            <div className="cash-row">
                                <span>{t('ips.inserted')}:</span>
                                <span className="inserted">{formatRSD(cashInserted)} RSD</span>
                            </div>
                            <div className={`cash-row status ${hasSurplus ? 'surplus' : 'remaining'}`}>
                                <span>{hasSurplus ? t('ips.surplus') : t('ips.remaining')}:</span>
                                <span>{formatRSD(Math.abs(cashRemaining))} RSD</span>
                            </div>
                        </div>

                        <div className="cash-buttons">
                            <p>{t('ips.insertBills')}:</p>
                            <div className="denomination-grid">
                                {[100, 200, 500, 1000, 2000, 5000].map(amount => (
                                    <button 
                                        key={amount}
                                        onClick={() => insertCash(amount)}
                                        className={`denom-btn d${amount}`}
                                    >
                                        {amount}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="cash-actions">
                            <button 
                                className="cancel"
                                onClick={() => setModalType('none')}
                            >
                                {t('common.cancel')}
                            </button>
                            <button 
                                className="complete"
                                onClick={completeCashPayment}
                                disabled={cashInserted < finalAmount}
                            >
                                {t('ips.completePayment')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recap Modal */}
            {modalType === 'recap' && (
                <div className="ips-modal-overlay">
                    <div className="ips-modal recap-modal">
                        <div className="recap-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="currentColor"/>
                                <path d="M8 12l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        
                        <h3>{t('ips.paymentComplete')}</h3>
                        
                        <div className="recap-details">
                            <div className="recap-row">
                                <span>{t('ips.billsTotal')}:</span>
                                <span>{formatRSD(totalBillAmount)} RSD</span>
                            </div>
                            <div className="recap-row">
                                <span>{t('ips.commission')}:</span>
                                <span>{formatRSD(totalCommission)} RSD</span>
                            </div>
                            <div className="recap-row total">
                                <span>{t('ips.totalPaid')}:</span>
                                <span>{formatRSD(finalAmount)} RSD</span>
                            </div>
                            {cashInserted > finalAmount && (
                                <div className="recap-row surplus">
                                    <span>{t('ips.surplusVoucher')}:</span>
                                    <span>{formatRSD(cashInserted - finalAmount)} RSD</span>
                                </div>
                            )}
                        </div>

                        <p className="recap-note">{t('ips.collectReceipt')}</p>

                        <button className="finish-btn" onClick={finishPayment}>
                            {t('ips.finish')}
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </Container>
    )
}
