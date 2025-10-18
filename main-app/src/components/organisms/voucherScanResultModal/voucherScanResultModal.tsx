import { confirmedIcon, redWarningIcon } from '@/assets/icons'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { useTranslate } from '@/i18n/useTranslate'

export type VoucherScanResultModalProps = {
    status: 'loading' | 'success' | 'error'
    successAmount?: number
    errorType?: 'over-limit' | 'invalid' | 'network' | 'other' | 'none'
    isOpen: boolean
    onClose: () => void
    onRetry?: () => void
}

export default function VoucherScanResultModal({
    status,
    successAmount = 0,
    errorType = 'other',
    isOpen,
    onClose,
    onRetry
}: VoucherScanResultModalProps) {
    const { t } = useTranslate()

    if (!isOpen) {
        return <></>
    }

    const getErrorMessage = () => {
        switch (errorType) {
            case 'over-limit':
                return t('voucherScanResultModal.errors.overLimit')
            case 'invalid':
                return t('voucherScanResultModal.errors.invalid')
            case 'network':
                return t('voucherScanResultModal.errors.network')
            default:
                return t('voucherScanResultModal.errors.other')
        }
    }

    if (status === 'loading') {
        return (
            <div className="voucher-scan-result-modal">
                <div className="modal-content loading">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                    <h1>{t('voucherScanResultModal.loadingTitle')}</h1>
                    <h2>{t('voucherScanResultModal.loadingDescription')}</h2>
                </div>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="voucher-scan-result-modal">
                <div className="modal-content success">
                    <div className="status-icon success-icon">
                        <img src={confirmedIcon} alt="Success" />
                    </div>
                    <h1>{t('voucherScanResultModal.successTitle')}</h1>
                    <h2>{t('voucherScanResultModal.successDescription')}</h2>
                    <div className="amount-display">
                        <span className="amount-label">
                            {t('voucherScanResultModal.amountTransferred')}
                        </span>
                        <span className="amount-value">
                            {successAmount.toLocaleString('sr-RS')} RSD
                        </span>
                    </div>
                    <div className="button-container">
                        <PrimaryButton
                            text={t('voucherScanResultModal.successButton')}
                            callback={onClose}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="voucher-scan-result-modal">
            <div className="modal-content error">
                <div className="status-icon error-icon">
                    <img src={redWarningIcon} alt="Error" />
                </div>
                <h1>{t('voucherScanResultModal.errorTitle')}</h1>
                <h2>{getErrorMessage()}</h2>
                <div className="button-container">
                    {onRetry && (
                        <PrimaryButton
                            text={t('voucherScanResultModal.retryButton')}
                            callback={onRetry}
                        />
                    )}
                    <PrimaryButton
                        text={t('voucherScanResultModal.closeButton')}
                        callback={onClose}
                    />
                </div>
            </div>
        </div>
    )
}
