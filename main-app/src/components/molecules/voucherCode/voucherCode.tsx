import QRCode from 'react-qr-code'

import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { useTranslate } from '@/i18n/useTranslate'

export default function VoucherCode({
    voucherCode
}: {
    voucherCode: VoucherConfirmation
}) {
    const { t } = useTranslate()

    return (
        <div className="voucher-code">
            <p className="title-label">{t('voucherCode.voucher')}</p>
            <p className="mono">{t('voucherGenerated.scan')}:</p>
            {voucherCode.qrCodeData && (
                <QRCode
                    value={voucherCode.qrCodeData}
                    size={200}
                    className="qr-code"
                />
            )}
            <p>{t('voucherCode.siteLink')}</p>
            <p className={'mono-title'}>{t('voucherCode.activationCode')}:</p>
            <p className={'mono-title'}>{voucherCode.voucherCode}</p>
        </div>
    )
}
