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

type IpsBill = {
    id: string
    recipient: string
    accountNumber: string
    referenceNumber: string
    purpose: string
    originalAmount: number
    amount: number // Mutable amount
}

type PaymentModal = 'none' | 'cash' | 'surplus' | 'recap'

const COMMISSION_RATE = 0.02 // 2%

export default function IpsPaymentTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const location = useLocation()
    const { setPaymentMethod, setCurrentStep } = useOrder()
    
    const [bills, setBills] = useState<IpsBill[]>([])
    const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [paymentModal, setPaymentModal] = useState<PaymentModal>('none')
    const [cashInserted, setCashInserted] = useState(0)
    const [editingAmount, setEditingAmount] = useState<string>('')
    const [editingAmountError, setEditingAmountError] = useState(false)
    const [showAmountDialog, setShowAmountDialog] = useState(false)
    const [selectedPayee, setSelectedPayee] = useState<string>('')
    const [recapData, setRecapData] = useState<{
        method: string
        paidAmount: number
        surplusAction: string | null
    } | null>(null)
    
    const abortControllerRef = useRef<AbortController | null>(null)

    // Calculate summary
    const calculateSummary = () => {
        const totalBillAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
        const totalCommission = totalBillAmount * COMMISSION_RATE
        const finalAmount = totalBillAmount + totalCommission
        return { totalBillAmount, totalCommission, finalAmount }
    }

    const summary = calculateSummary()
    const selectedBill = bills.find(b => b.id === selectedBillId)
    const remaining = summary.finalAmount - cashInserted
    const hasSurplus = remaining <= 0
    const surplusAmount = hasSurplus ? Math.abs(remaining) : 0

    // Handle QR scan (mock implementation)
    const handleScan = useCallback((value: string) => {
        console.log('QR Code scanned:', value)
        
        // Mock bills data
        const mockBills: Omit<IpsBill, 'id'>[] = [
            {
                recipient: 'Infostan Beograd',
                accountNumber: '840-0000000346152-05',
                referenceNumber: '97 10-00000000001',
                purpose: 'Komunalne Usluge',
                originalAmount: 5500.50,
                amount: 5500.50
            },
            {
                recipient: 'Telekom Srbija AD',
                accountNumber: '205-1234567890123-14',
                referenceNumber: '97 00-98765432101',
                purpose: 'Telefonske Usluge',
                originalAmount: 1250.00,
                amount: 1250.00
            },
            {
                recipient: 'EPS Snabdevanje',
                accountNumber: '325-1112223334445-12',
                referenceNumber: '97 12-00000000002',
                purpose: 'Električna Energija',
                originalAmount: 8900.25,
                amount: 8900.25
            }
        ]
        
        const nextBillIndex = bills.length % mockBills.length
        const newBill: IpsBill = {
            id: `bill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...mockBills[nextBillIndex]
        }
        
        setBills(prev => [...prev, newBill])
        setIsScanning(false)
        setSelectedBillId(newBill.id)
    }, [bills.length])

    // Start scanning
    const startScanning = useCallback(() => {
        setIsScanning(true)
        // Mock: simulate scan after 2 seconds
        setTimeout(() => {
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

    // Select bill
    const handleSelectBill = (id: string) => {
        setSelectedBillId(id)
        const bill = bills.find(b => b.id === id)
        if (bill) {
            setEditingAmount(bill.amount.toFixed(2))
            setEditingAmountError(false)
        }
    }

    // Validate and save amount
    const handleSaveAmount = (value: string) => {
        if (!selectedBillId) return
        
        const newAmount = parseFloat(value)
        const bill = bills.find(b => b.id === selectedBillId)
        
        if (!bill || isNaN(newAmount) || newAmount < bill.originalAmount) {
            return
        }
        
        setBills(prev => prev.map(b => 
            b.id === selectedBillId ? { ...b, amount: newAmount } : b
        ))
        setEditingAmount(newAmount.toFixed(2))
        setEditingAmountError(false)
    }

    // Open cash payment modal
    const openCashModal = () => {
        setCashInserted(0)
        setPaymentModal('cash')
    }

    // Insert cash
    const handleInsertCash = (amount: number) => {
        setCashInserted(prev => prev + amount)
    }

    // Complete cash payment
    const handleCompleteCashPayment = () => {
        if (hasSurplus && surplusAmount > 0) {
            setPaymentModal('surplus')
        } else {
            handleShowRecap('Gotovina', summary.finalAmount, null)
        }
    }

    // Get unique payees from bills
    const uniquePayees = Array.from(new Set(bills.map(b => b.recipient)))

    // Handle surplus options
    const handleApplyCredit = () => {
        if (!selectedPayee) return
        const netCredit = surplusAmount / (1 + COMMISSION_RATE)
        const commission = surplusAmount - netCredit
        const action = `Kredit od ${formatRSD(netCredit)} RSD prebačen na ${selectedPayee} (Provizija: ${formatRSD(commission)} RSD)`
        handleShowRecap('Gotovina', cashInserted, action)
    }

    const handleIssueVoucher = () => {
        const voucherCode = `VOUCHER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
        const action = `Izdat Vaučer (kod: ${voucherCode}) u iznosu od ${formatRSD(surplusAmount)} RSD`
        handleShowRecap('Gotovina', cashInserted, action)
    }

    // Show recap modal
    const handleShowRecap = (method: string, paidAmount: number, surplusAction: string | null) => {
        setRecapData({ method, paidAmount, surplusAction })
        setPaymentModal('recap')
    }

    // Process card payment
    const handleCardPayment = () => {
        navigate('/payment-method', {
            state: {
                voucherType: 'ips',
                bills: bills,
                totalAmount: summary.finalAmount
            }
        })
    }

    // Reset app
    const handleReset = () => {
        setBills([])
        setSelectedBillId(null)
        setCashInserted(0)
        setEditingAmount('')
        setPaymentModal('none')
        setSelectedPayee('')
        setRecapData(null)
        setIsScanning(false)
    }

    // Format RSD (Serbian format with comma)
    const formatRSD = (num: number) => {
        return num.toFixed(2).replace('.', ',')
    }

    useEffect(() => {
        return () => {
            stopScanning()
        }
    }, [stopScanning])

    // Auto-start scanning when component mounts
    useEffect(() => {
        if (bills.length === 0 && !isScanning) {
            // Don't auto-start, wait for user action
        }
    }, [])

    return (
        <Container isFullHeight={true}>
            <Header 
                navigateBackUrl={'/welcome-with-services'} 
                navigationBackText={t('header.back')} 
            />
            <div className="ips-payment">
                {/* Header Section */}
                <div className="ips-header">
                    <h1>{t('ipsPayment.title')}</h1>
                    <p>{t('ipsPayment.subtitle')}</p>
                </div>

                {/* Main Content: Bill List and Details */}
                <main className="ips-main-content">
                    {/* Bill List Section */}
                    <div className="ips-bill-list-section">
                        <h2>
                            {t('ipsPayment.scannedBills') || '1. Skenirani Računi'} 
                            <span className="bill-count">({bills.length})</span>
                        </h2>
                        
                        {bills.length === 0 ? (
                            <div className="ips-empty-state">
                                {isScanning ? (
                                    <>
                                        <div className="scanning-animation"></div>
                                        <p>{t('ipsPayment.scanning')}</p>
                                        <p className="scanning-hint">{t('ipsPayment.scanningHint')}</p>
                                        <PrimaryButton
                                            text={t('ipsPayment.cancel')}
                                            callback={stopScanning}
                                            inverted={true}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className="empty-icon">📄</div>
                                        <p>{t('ipsPayment.emptyState') || 'Prinesite IPS QR kod skeneru.'}</p>
                                        <p className="empty-hint">
                                            {t('ipsPayment.emptyHint') || 'Svi skenirani računi će se pojaviti ovde.'}
                                        </p>
                                        <PrimaryButton
                                            text={t('ipsPayment.scanQR')}
                                            callback={startScanning}
                                        />
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="ips-bill-list">
                                {bills.map((bill) => (
                                    <div
                                        key={bill.id}
                                        className={`bill-item ${selectedBillId === bill.id ? 'active' : ''}`}
                                        onClick={() => handleSelectBill(bill.id)}>
                                        <div className="bill-item-info">
                                            <span className="bill-recipient">{bill.recipient}</span>
                                            <span className="bill-reference">
                                                {t('ipsPayment.referenceNumber')}: {bill.referenceNumber}
                                            </span>
                                        </div>
                                        <div className="bill-item-amount">
                                            <span className="bill-amount">{formatRSD(bill.amount)} RSD</span>
                                            {bill.amount !== bill.originalAmount && (
                                                <span className="bill-modified">
                                                    ({t('ipsPayment.modified') || 'IZMENJEN'})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bill Details Section */}
                    <div className="ips-bill-details">
                        <h3>{t('ipsPayment.detailsAndEdit') || '2. Detalji i Izmena Iznosa'}</h3>
                        
                        {!selectedBill ? (
                            <div className="ips-detail-prompt">
                                <p>{t('ipsPayment.selectBillPrompt') || 'Izaberite račun sa liste iznad da biste videli detalje i promenili iznos.'}</p>
                            </div>
                        ) : (
                            <div className="ips-detailed-view">
                                <div className="bill-detail-fields">
                                    <div className="detail-row">
                                        <strong>{t('ipsPayment.recipient') || 'Primalac'}:</strong>
                                        <span>{selectedBill.recipient}</span>
                                    </div>
                                    <div className="detail-row">
                                        <strong>{t('ipsPayment.accountNumber')}:</strong>
                                        <span>{selectedBill.accountNumber}</span>
                                    </div>
                                    <div className="detail-row full-width">
                                        <strong>{t('ipsPayment.referenceNumber')}:</strong>
                                        <span className="mono">{selectedBill.referenceNumber}</span>
                                    </div>
                                    <div className="detail-row full-width">
                                        <strong>{t('ipsPayment.purpose') || 'SVRHA'}:</strong>
                                        <span>{selectedBill.purpose}</span>
                                    </div>
                                </div>

                                <div className="amount-edit-section">
                                    <label>
                                        {t('ipsPayment.amountForPayment') || 'Iznos za Plaćanje (RSD)'}:
                                    </label>
                                    <div 
                                        className="amount-input-container"
                                        onClick={() => setShowAmountDialog(true)}>
                                        <input
                                            type="text"
                                            value={editingAmount}
                                            placeholder="0.00"
                                            readOnly
                                        />
                                    </div>
                                    {editingAmount && parseFloat(editingAmount) < selectedBill.originalAmount && (
                                        <p className="amount-error">
                                            {t('ipsPayment.amountError') || 'Iznos ne može biti manji od originalnog.'}
                                        </p>
                                    )}
                                    <PrimaryButton
                                        text={t('ipsPayment.saveAmount') || 'Sačuvaj Izmenu'}
                                        callback={() => handleSaveAmount(editingAmount)}
                                        isDisabled={
                                            !editingAmount || 
                                            parseFloat(editingAmount) === selectedBill.amount ||
                                            parseFloat(editingAmount) < selectedBill.originalAmount
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Bottom Panel: Summary and Payment */}
                <div className="ips-bottom-panel">
                    {/* Summary Card */}
                    <div className="ips-summary-card">
                        <h2>{t('ipsPayment.financialOverview') || '3. Finansijski Pregled (RSD)'}</h2>
                        <div className="summary-content">
                            <div className="summary-row">
                                <span>{t('ipsPayment.totalBillAmount') || 'Ukupan Iznos Računa'}:</span>
                                <span className="summary-value">{formatRSD(summary.totalBillAmount)}</span>
                            </div>
                            <div className="summary-row">
                                <span>{t('ipsPayment.totalCommission') || 'Ukupna Provizija (Komisija)'}:</span>
                                <span className="summary-value commission">{formatRSD(summary.totalCommission)}</span>
                            </div>
                            <div className="summary-total">
                                <span>{t('ipsPayment.totalToPay') || 'UKUPNO ZA PLAĆANJE'}:</span>
                                <span className="total-amount">{formatRSD(summary.finalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="ips-payment-methods">
                        <h3>{t('ipsPayment.paymentMethod') || '4. Način Plaćanja'}</h3>
                        <div className="payment-buttons">
                            <PrimaryButton
                                text={t('ipsPayment.cashPayment') || 'Plaćanje Gotovinom'}
                                callback={openCashModal}
                                isDisabled={bills.length === 0}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.cardPayment') || 'Plaćanje Karticom'}
                                callback={handleCardPayment}
                                isDisabled={bills.length === 0}
                                inverted={true}
                            />
                        </div>
                        <button 
                            className="reset-button"
                            onClick={handleReset}>
                            {t('ipsPayment.cancelTransaction') || 'Otkaži Transakciju i Resetuj'}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Cash Payment Modal */}
            {paymentModal === 'cash' && (
                <div className="ips-modal-overlay" onClick={() => setPaymentModal('none')}>
                    <div className="ips-modal cash-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{t('ipsPayment.cashPayment')}</h3>
                        
                        <div className="cash-warning">
                            <p className="warning-title">
                                {t('ipsPayment.importantWarning') || 'VAŽNO UPOZORENJE'}:
                            </p>
                            <p>
                                {t('ipsPayment.cashWarning') || 'Kiosk prima samo novčanice od **100 RSD** i veće. **Kiosk ne vraća kusur.** Sav višak uplaćenih sredstava biće knjižen kao KREDIT ili VAUČER.'}
                            </p>
                        </div>

                        <div className="cash-summary-grid">
                            <div className="cash-summary-item">
                                <span>{t('ipsPayment.totalToPay')}:</span>
                                <span className="cash-amount due">{formatRSD(summary.finalAmount)} RSD</span>
                            </div>
                            <div className="cash-summary-item">
                                <span>{t('ipsPayment.insertedAmount') || 'Uplaćeno Sredstava'}:</span>
                                <span className="cash-amount inserted">{formatRSD(cashInserted)} RSD</span>
                            </div>
                        </div>

                        <div className={`cash-status ${hasSurplus ? 'surplus' : 'remaining'}`}>
                            <span className="status-label">
                                {hasSurplus 
                                    ? (t('ipsPayment.surplusAmount') || 'Višak Sredstava (Kusur)')
                                    : (t('ipsPayment.remainingToPay') || 'Potrebno Uplatiti Još')
                                }:
                            </span>
                            <span className="status-amount">
                                {formatRSD(hasSurplus ? surplusAmount : remaining)} RSD
                            </span>
                        </div>

                        <div className="cash-buttons-section">
                            <h4>{t('ipsPayment.insertBills') || 'Simulacija Ubacivanja Novčanica'}:</h4>
                            <div className="cash-buttons-grid">
                                <button onClick={() => handleInsertCash(100)}>100 RSD</button>
                                <button onClick={() => handleInsertCash(200)}>200 RSD</button>
                                <button onClick={() => handleInsertCash(500)}>500 RSD</button>
                                <button onClick={() => handleInsertCash(1000)}>1000 RSD</button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <PrimaryButton
                                text={t('ipsPayment.cancel')}
                                callback={() => setPaymentModal('none')}
                                inverted={true}
                            />
                            <PrimaryButton
                                text={t('ipsPayment.completePayment') || 'Završi Plaćanje'}
                                callback={handleCompleteCashPayment}
                                isDisabled={!hasSurplus}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Surplus Options Modal */}
            {paymentModal === 'surplus' && (
                <div className="ips-modal-overlay" onClick={() => setPaymentModal('none')}>
                    <div className="ips-modal surplus-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{t('ipsPayment.surplusOptions') || 'Opcije Viška Sredstava'}</h3>
                        
                        <div className="surplus-info">
                            <p>
                                {t('ipsPayment.paidAmount') || 'Plaćeno'}: 
                                <span className="paid-amount">{formatRSD(cashInserted)} RSD</span>
                            </p>
                            <p className="surplus-display">
                                {t('ipsPayment.surplusForDistribution') || 'Višak (Kusur) za raspodelu'}: 
                                <span>{formatRSD(surplusAmount)} RSD</span>
                            </p>
                        </div>

                        <h4>{t('ipsPayment.chooseSurplusOption') || 'Izaberite kako želite da iskoristite višak'}:</h4>
                        
                        <div className="surplus-options-grid">
                            <div className="surplus-option credit-option">
                                <h5>1. {t('ipsPayment.transferAsCredit') || 'Prenesi kao Kredit Pružaocu Usluga'}</h5>
                                <p>{t('ipsPayment.creditDescription') || 'Višak će biti prebačen kao neto kredit na Vaš račun. Provizija za transfer viška je pokrivena uplaćenim iznosom.'}</p>
                                
                                <div className="credit-breakdown">
                                    <div className="breakdown-row">
                                        <span>{t('ipsPayment.grossSurplus') || 'Bruto Višak'}:</span>
                                        <span>{formatRSD(surplusAmount)} RSD</span>
                                    </div>
                                    <div className="breakdown-row">
                                        <span>
                                            {t('ipsPayment.commission') || 'Provizija'} 
                                            ({COMMISSION_RATE * 100}%):
                                        </span>
                                        <span>{formatRSD(surplusAmount - (surplusAmount / (1 + COMMISSION_RATE)))} RSD</span>
                                    </div>
                                    <div className="breakdown-row total">
                                        <span>{t('ipsPayment.netCredit') || 'NETO Kredit na Račun'}:</span>
                                        <span className="net-credit">
                                            {formatRSD(surplusAmount / (1 + COMMISSION_RATE))} RSD
                                        </span>
                                    </div>
                                </div>

                                <label htmlFor="credit-payee-select">
                                    {t('ipsPayment.selectPayee')}:
                                </label>
                                <select
                                    id="credit-payee-select"
                                    value={selectedPayee}
                                    onChange={(e) => setSelectedPayee(e.target.value)}
                                    className="payee-select">
                                    <option value="" disabled>
                                        -- {t('ipsPayment.selectPayee')} --
                                    </option>
                                    {uniquePayees.map(payee => (
                                        <option key={payee} value={payee}>{payee}</option>
                                    ))}
                                </select>

                                <PrimaryButton
                                    text={t('ipsPayment.confirmCredit')}
                                    callback={handleApplyCredit}
                                    isDisabled={!selectedPayee}
                                />
                            </div>

                            <div className="surplus-option voucher-option">
                                <h5>2. {t('ipsPayment.issueVoucher') || 'Izdaj Vaučer (Kusur)'}</h5>
                                <p>
                                    {t('ipsPayment.voucherDescription') || 'Dobićete štampani vaučer kod u iznosu viška, koji možete iskoristiti prilikom sledećeg plaćanja na ovom kiosku.'}
                                </p>
                                <PrimaryButton
                                    text={t('ipsPayment.issueVoucher')}
                                    callback={handleIssueVoucher}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recap Modal */}
            {paymentModal === 'recap' && recapData && (
                <div className="ips-modal-overlay" onClick={() => setPaymentModal('none')}>
                    <div className="ips-modal recap-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{t('ipsPayment.paymentRecap')}</h3>
                        
                        <div className="recap-section">
                            <h4>{t('ipsPayment.transactionDetails')}:</h4>
                            <div className="recap-details">
                                <div className="recap-row">
                                    <span>{t('ipsPayment.totalDebt')}:</span>
                                    <span>{formatRSD(summary.totalBillAmount)} RSD</span>
                                </div>
                                <div className="recap-row">
                                    <span>{t('ipsPayment.paymentCommission')}:</span>
                                    <span className="commission">{formatRSD(summary.totalCommission)} RSD</span>
                                </div>
                                <div className="recap-row total">
                                    <span>{t('ipsPayment.totalToPay')}:</span>
                                    <span className="total-amount">{formatRSD(summary.finalAmount)} RSD</span>
                                </div>
                            </div>
                        </div>

                        <div className="recap-section payment-details">
                            <h4>{t('ipsPayment.paymentDetails')}:</h4>
                            <div className="recap-details">
                                <div className="recap-row">
                                    <span>{t('ipsPayment.paymentMethod')}:</span>
                                    <span>{recapData.method}</span>
                                </div>
                                <div className="recap-row">
                                    <span>{t('ipsPayment.paidAmount')}:</span>
                                    <span className="paid">{formatRSD(recapData.paidAmount)} RSD</span>
                                </div>
                                {recapData.surplusAction && recapData.paidAmount > summary.finalAmount && (
                                    <div className="recap-surplus-section">
                                        <div className="recap-row surplus">
                                            <span>{t('ipsPayment.surplusAmount')}:</span>
                                            <span>{formatRSD(recapData.paidAmount - summary.finalAmount)} RSD</span>
                                        </div>
                                        <p className="surplus-action">{recapData.surplusAction}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <PrimaryButton
                            text={t('ipsPayment.takeReceiptAndFinish')}
                            callback={() => {
                                setPaymentModal('none')
                                setRecapData(null)
                                handleReset()
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Amount Input Dialog */}
            {showAmountDialog && selectedBill && (
                <IpsInputDialog
                    isOpen={true}
                    title={t('ipsPayment.amountForPayment')}
                    label={t('ipsPayment.amountForPayment')}
                    value={editingAmount}
                    type="amount"
                    placeholder="0.00"
                    onClose={() => setShowAmountDialog(false)}
                    onConfirm={(value) => {
                        setEditingAmount(value)
                        setShowAmountDialog(false)
                    }}
                />
            )}
        </Container>
    )
}
