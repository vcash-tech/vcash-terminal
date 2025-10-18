import { useCallback, useEffect, useRef } from 'react'

import { deviceIcon } from '@/assets/icons'
import { qrCode } from '@/assets/images'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'
import { useTranslate } from '@/i18n/useTranslate'
import { apiService } from '@/services/apiService'

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

    useEffect(() => {
        isOpenRef.current = isOpen

        if (!isOpen) {
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
