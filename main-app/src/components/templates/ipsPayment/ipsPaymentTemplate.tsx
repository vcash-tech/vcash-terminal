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

// Print data structure for IPS confirmation
interface IPSPrintData {
    venueName: string
    venueAddress: string
    venueCity: string
    deviceName: string
    billCount: number
    bills: Array<{
        recipient: string
        accountNumber: string
        referenceNumber: string
        purpose: string
        amount: string
    }>
    totalBillAmount: string
    commissionRate: string
    totalCommission: string
    totalPaid: string
    surplusAmount: string
    surplusVoucherCode: string
    paymentMethod: 'cash' | 'card'
    transactionDate: string
    transactionCode: string
    terminalId: string
    currentTime: string
}

type ModalType = 'none' | 'success' | 'error' | 'cash' | 'recap' | 'printing'

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
    const [scanPaused, setScanPaused] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const billsListRef = useRef<HTMLDivElement | null>(null)

    // Modal state
    const [modalType, setModalType] = useState<ModalType>('none')
    const [modalMessage, setModalMessage] = useState('')

    // Cash payment state
    const [cashInserted, setCashInserted] = useState(0)
    
    // Payment method tracking
    const [paymentMethodUsed, setPaymentMethodUsed] = useState<'cash' | 'card'>('cash')

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

    // Start/restart scanning with delay to prevent double scans
    const startScanning = useCallback(async (withDelay = false) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        
        // Pause for 2 seconds after a successful scan
        if (withDelay) {
            setScanPaused(true)
            setIsScanning(false)
            await new Promise(resolve => setTimeout(resolve, 2000))
            setScanPaused(false)
        }
        
        setIsScanning(true)
        
        try {
            abortControllerRef.current = new AbortController()
            const value = await apiService.startQrScanner(
                abortControllerRef.current.signal,
                sessionId
            )
            handleScan(value || '')
            // Continue scanning for more bills (with delay)
            startScanning(true)
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

    // Auto-scroll bills list when new bill is added
    useEffect(() => {
        if (billsListRef.current && bills.length > 0) {
            billsListRef.current.scrollTo({
                top: billsListRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [bills.length])

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

    // Generate transaction code
    const generateTransactionCode = (): string => {
        const now = new Date()
        const dateStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 14)
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        return `IPS-${dateStr}${random}`
    }

    // Format date for print
    const formatDateTime = (date: Date): string => {
        return date.toLocaleString('sr-RS', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '.')
    }

    // Print IPS confirmation receipt
    const printIPSConfirmation = async (method: 'cash' | 'card', paidAmount: number): Promise<boolean> => {
        try {
            const templateRendererUrl = import.meta.env.VITE_TEMPLATE_RENDERER_URL
            if (!templateRendererUrl) {
                console.error('VITE_TEMPLATE_RENDERER_URL not configured')
                return false
            }

            const now = new Date()
            const surplus = method === 'cash' ? Math.max(0, paidAmount - finalAmount) : 0

            // Build print data object
            const printData: IPSPrintData = {
                venueName: 'VCash Kiosk',
                venueAddress: '',
                venueCity: '',
                deviceName: '',
                billCount: bills.length,
                bills: bills.map(bill => ({
                    recipient: bill.recipient,
                    accountNumber: bill.accountNumber,
                    referenceNumber: bill.referenceNumber,
                    purpose: bill.purpose,
                    amount: formatRSD(bill.amount)
                })),
                totalBillAmount: formatRSD(totalBillAmount),
                commissionRate: '2',
                totalCommission: formatRSD(totalCommission),
                totalPaid: formatRSD(finalAmount),
                surplusAmount: surplus > 0 ? formatRSD(surplus) : '',
                surplusVoucherCode: '', // TODO: Generate voucher code if surplus
                paymentMethod: method,
                transactionDate: formatDateTime(now),
                transactionCode: generateTransactionCode(),
                terminalId: '',
                currentTime: formatDateTime(now)
            }

            // Convert to base64 with proper UTF-8 handling
            const jsonString = JSON.stringify(printData)
            const utf8Bytes = new TextEncoder().encode(jsonString)
            const base64Data = btoa(
                Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('')
            )

            // Construct the print URL with the new template name
            const printUrl = `${templateRendererUrl}/ips_confirmation?rotate=180&data=${encodeURIComponent(base64Data)}&type=bmp`

            console.log('Printing IPS confirmation with URL:', printUrl)

            // Call print with timeout
            const printPromise = apiService.print(printUrl, sessionId)
            const timeoutPromise = new Promise<{ success: boolean; message: string }>((resolve) => {
                setTimeout(() => {
                    console.log('Print operation timed out after 10 seconds')
                    resolve({ success: false, message: 'Print timeout' })
                }, 10000)
            })

            const result = await Promise.race([printPromise, timeoutPromise])
            console.log('Print result:', result)

            return result.success
        } catch (error) {
            console.error('Print error:', error)
            return false
        }
    }

    // Complete cash payment
    const completeCashPayment = async () => {
        if (cashInserted >= finalAmount) {
            setPaymentMethodUsed('cash')
            setModalType('printing')
            
            // Print confirmation
            await printIPSConfirmation('cash', cashInserted)
            
            // Show recap regardless of print result
            setModalType('recap')
        }
    }

    // Process card payment
    const processCardPayment = async () => {
        setPaymentMethod('card')
        setPaymentMethodUsed('card')
        setModalType('printing')
        
        // Print confirmation
        await printIPSConfirmation('card', finalAmount)
        
        // Show recap regardless of print result
        setModalType('recap')
    }

    // Finish and reset
    const finishPayment = () => {
        setModalType('none')
        setBills([])
        setSelectedBillId(null)
        setCashInserted(0)
        setPaymentMethodUsed('cash')
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
                                <div className={`scan-icon ${scanPaused ? 'paused' : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4m0 0h3M4 4l.113.113M17 4h3m0 0v3m0-3l-.113.113M4 17v3m0 0h3M4 20l.113-.113M17 20h3m0 0v-3m0 3l-.113-.113M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                    </svg>
                                </div>
                                <p className="prompt-text">{t('ips.scanPrompt')}</p>
                                <p className="prompt-subtext">{t('ips.scanPromptSub')}</p>
                                {(isScanning || scanPaused) && (
                                    <div className={`scanning-indicator ${scanPaused ? 'paused' : ''}`}>
                                        <span className="pulse"></span>
                                        {scanPaused ? t('ips.scanPaused') : t('ips.scannerActive')}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bills-list" ref={billsListRef}>
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
                                
                                {(isScanning || scanPaused) && (
                                    <div className={`scanning-indicator inline ${scanPaused ? 'paused' : ''}`}>
                                        <span className="pulse"></span>
                                        {scanPaused ? t('ips.scanPaused') : t('ips.scanMore')}
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

            {/* Printing Modal */}
            {modalType === 'printing' && (
                <div className="ips-modal-overlay">
                    <div className="ips-modal printing-modal">
                        <div className="printing-spinner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M8.76 15.24l-2.83 2.83m11.14 0l-2.83-2.83M8.76 8.76L5.93 5.93" />
                            </svg>
                        </div>
                        <h3>{t('ips.printing')}</h3>
                        <p>{t('ips.printingDescription')}</p>
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
                            {paymentMethodUsed === 'cash' && cashInserted > finalAmount && (
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
