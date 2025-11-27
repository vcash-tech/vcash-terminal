import React, { useCallback, useEffect, useRef, useState } from 'react'

import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { useTranslate } from '@/i18n/useTranslate'
import { apiService } from '@/services/apiService'

import { scanVoucher } from '../../../assets/images'

export type VoucherScannerModalProps = {
    isOpen: boolean
    onScan: (value: string) => void
    onClose: () => void
}

export default function VoucherScannerModal({
    isOpen,
    onScan,
    onClose
}: VoucherScannerModalProps) {
    const [isManualInput, setIsManualInput] = useState(false)
    const [manualCode, setManualCode] = useState('')
    const { t } = useTranslate()
    const abortControllerRef = useRef<AbortController | null>(null)
    const isOpenRef = useRef(isOpen)

    // Stable callback to avoid useEffect re-runs
    const handleScan = useCallback(
        (value: string) => {
            onScan(value)
        },
        [onScan]
    )

    // Format code as XXX-XXX-XXX
    const formatCode = (code: string) => {
        const digits = code.replace(/\D/g, '').slice(0, 9)
        if (digits.length <= 3) return digits
        if (digits.length <= 6)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    }

    // Handle numeric input
    const handleNumericInput = (
        digit: string,
        event?: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (manualCode.replace(/\D/g, '').length < 9) {
            const newCode = manualCode.replace(/\D/g, '') + digit
            setManualCode(formatCode(newCode))
        }
        // Remove focus from button to prevent highlighting
        if (event?.currentTarget) {
            event.currentTarget.blur()
        }
    }

    // Handle backspace
    const handleBackspace = (event?: React.MouseEvent<HTMLButtonElement>) => {
        const digits = manualCode.replace(/\D/g, '')
        if (digits.length > 0) {
            const newDigits = digits.slice(0, -1)
            setManualCode(formatCode(newDigits))
        }
        // Remove focus from button to prevent highlighting
        if (event?.currentTarget) {
            event.currentTarget.blur()
        }
    }

    // Handle clear
    const handleClear = (event?: React.MouseEvent<HTMLButtonElement>) => {
        setManualCode('')
        // Remove focus from button to prevent highlighting
        if (event?.currentTarget) {
            event.currentTarget.blur()
        }
    }

    // Handle manual code submission
    const handleManualSubmit = () => {
        const digits = manualCode.replace(/\D/g, '')
        if (digits.length === 9) {
            const formattedCode = formatCode(digits)
            onScan(`http://localhost?mode=manual&code=${formattedCode}`)
        }
    }

    // Check if code is complete
    const isCodeComplete = manualCode.replace(/\D/g, '').length === 9

    useEffect(() => {
        isOpenRef.current = isOpen

        if (!isOpen) {
            // Reset state when modal closes
            setIsManualInput(false)
            setManualCode('')
            return
        }

        const startScanning = async () => {
            try {
                // Create new abort controller for this scan session
                abortControllerRef.current = new AbortController()
                console.log('start scan')

                // apiService.startQrScanner handles timeout retries internally with while(true)
                // It will keep retrying until a QR code is found or the request is aborted
                const value = await apiService.startQrScanner(
                    abortControllerRef.current.signal
                )

                // Only call onScan if modal is still open
                if (isOpenRef.current) {
                    handleScan(value || '')
                }
            } catch (e) {
                // Only log errors if the modal is still open (not aborted due to close)
                if (isOpenRef.current) {
                    console.log('🔍 VoucherScannerModal: Scanner error:', e)
                }
            }
        }

        // Always start scanning when modal opens, regardless of manual input mode
        startScanning()

        // Cleanup function
        return () => {
            console.log('aborting scan')
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
                abortControllerRef.current = null
            }
            // Stop the scanner with a slight delay to ensure abort is processed
            setTimeout(() => {
                apiService.stopQrScanner()
            }, 200)
        }
    }, [isOpen, handleScan])

    if (!isOpen) {
        return <></>
    }

    if (isManualInput) {
        return (
            <div className="voucher-scanner-modal">
                <div className="modal-content manual-input">
                    <h1>{t('voucherScannerModal.title')}</h1>
                    <h2>{t('voucherScannerModal.manualInputTitle')}</h2>
                    <span className="manual-description">
                        {t('voucherSannerModal.manualInputDescription')}
                    </span>
                    <span className="code-format">
                        {t('voucherScannerModal.codeFormat')}
                    </span>

                    {/* Code input display */}
                    <div className="code-input-display">
                        {Array.from({ length: 9 }, (_, index) => {
                            const digits = manualCode.replace(/\D/g, '')
                            const digit = digits[index] || ''
                            const showDash = index === 2 || index === 5

                            return (
                                <div key={index} className="code-input-group">
                                    <div
                                        className={`code-digit ${digit ? 'filled' : ''}`}>
                                        {digit}
                                    </div>
                                    {showDash && (
                                        <span className="code-dash">-</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Submit button */}
                    <div className="submit-button-container">
                        <PrimaryButton
                            text={t('voucherScannerModal.submitButton')}
                            callback={handleManualSubmit}
                            isDisabled={!isCodeComplete}
                        />
                    </div>

                    {/* Numeric keyboard */}
                    <div className="numeric-keyboard">
                        <div className="keyboard-row">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    className="keyboard-key"
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) =>
                                        handleNumericInput(num.toString(), e)
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
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) =>
                                        handleNumericInput(num.toString(), e)
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
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) =>
                                        handleNumericInput(num.toString(), e)
                                    }>
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
                                onClick={(e) => handleNumericInput('0', e)}>
                                0
                            </button>
                            <button
                                className="keyboard-key clear"
                                tabIndex={-1}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleClear}>
                                C
                            </button>
                        </div>
                    </div>

                    {/* Cancel button */}
                    <div className="cancel-button-container">
                        <PrimaryButton
                            text={t('voucherScannerModal.cancelButton')}
                            callback={onClose}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="voucher-scanner-modal">
            <div className="modal-content">
                <h1>{t('voucherScannerModal.title')}</h1>
                <h2>{t('voucherScannerModal.scanTitle')}</h2>
                <span>{t('voucherScannerModal.scanDescription')}</span>
                <img
                    src={scanVoucher}
                    alt={t('voucherScannerModal.scannerImageAlt')}
                />
                <span className="scan-active">
                    {t('voucherScannerModal.scanActive')}
                </span>
                <button
                    className="alt-input"
                    onClick={() => {
                        setIsManualInput(true)
                        setManualCode('')
                    }}>
                    {t('voucherScannerModal.altButton')}
                </button>
                <PrimaryButton
                    text={t('voucherScannerModal.cancelButton')}
                    callback={onClose}
                />
            </div>
        </div>
    )
}
