import { useEffect } from 'react'

import { deviceIcon } from '@/assets/icons'
import { qrCode } from '@/assets/images'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'
import { useTranslate } from '@/i18n/useTranslate'
import { apiService, QrScannerTimeoutError } from '@/services/apiService'
import { TransactionService } from '@/services/transactionService'

export type VoucherScannerModalProps = {
    isOpen: boolean
    onClose: () => void
}

export default function VoucherScannerModal({
    isOpen,
    onClose
}: VoucherScannerModalProps) {
    const { t } = useTranslate()

    // Business logic useEffect with retry logic for timeout errors
    useEffect(() => {
        let isActive = true
        const abortController = new AbortController()

        const startScanning = async () => {
            if (!isOpen || !isActive) return

            console.log(
                '🔍 VoucherScannerModal: Scanner activated, ready to scan existing voucher'
            )

            while (isActive) {
                try {
                    const content = await apiService.startQrScanner(
                        abortController.signal
                    )

                    if (!isActive) break // Component unmounted during scan

                    const url = new URL(content)
                    const code = url.searchParams.get('code') || ''

                    if (!code) {
                        alert('🔍 VoucherScannerModal: No code found')
                        break
                    }

                    try {
                        await TransactionService.CreateDraftFromVoucher({
                            voucherCode: code
                        })
                    } catch (error) {
                        alert(
                            '🔍 VoucherScannerModal: Draft from voucher error:' +
                                JSON.stringify(error)
                        )
                    }

                    // Success - break out of retry loop
                    break
                } catch (error) {
                    if (!isActive) break // Component unmounted during error handling

                    // If it's a timeout error, continue the loop to retry
                    if (error instanceof QrScannerTimeoutError) {
                        console.log(
                            '🔍 VoucherScannerModal: Scan timeout, retrying...'
                        )
                        continue
                    }

                    // For all other errors, show alert and break out of loop
                    alert(
                        '🔍 VoucherScannerModal: Scanner error:' +
                            JSON.stringify(error)
                    )
                    break
                }
            }

            // Cleanup and close modal (finally equivalent)
            abortController.abort()
            try {
                await apiService.stopQrScanner()
            } catch (error) {
                console.error('Error stopping QR scanner:', error)
            }

            // Always close the modal when we exit the scanning loop
            if (isActive) {
                onClose()
            }
        }

        if (isOpen) {
            startScanning()
        }

        return () => {
            isActive = false
            abortController.abort()
            if (isOpen) {
                console.log('🔍 VoucherScannerModal: Scanner deactivated')
                apiService.stopQrScanner().catch((error) => {
                    console.error(
                        'Error stopping QR scanner during cleanup:',
                        error
                    )
                })
            }
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return <></>
    }

    return (
        <div className="voucher-scanner-modal">
            <div className="modal-content">
                <IconHeading
                    heading={t('voucherScannerModal.title')}
                    icon={deviceIcon}
                />
                <p className="scanner-description">
                    {t('voucherScannerModal.description')}
                </p>
                <div className="scanner-image-container">
                    <img
                        src={qrCode}
                        className="scanner-image"
                        alt={t('voucherScannerModal.scannerImageAlt')}
                    />
                    <div className="scanner-overlay">
                        <div className="scanner-frame"></div>
                    </div>
                </div>
                <p className="scanner-instruction">
                    {t('voucherScannerModal.instruction')}
                </p>
                <PrimaryButton
                    text={t('voucherScannerModal.cancelButton')}
                    callback={onClose}
                />
                <SessionCounter />
            </div>
        </div>
    )
}
