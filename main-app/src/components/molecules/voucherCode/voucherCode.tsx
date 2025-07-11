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
            <p className="title-label">VCASH {t('home.code.voucher')}</p>
            <p className="mono">{t('home.code.scan')}:</p>
            {voucherCode.qrCodeData && (
                <QRCode
                    value={voucherCode.qrCodeData}
                    size={200}
                    className="qr-code"
                />
            )}
            <p className={"mono"} dangerouslySetInnerHTML={{ __html: t('home.code.siteLink') }} />
            <p className={'mono-title'}>{t('home.code.activationCode')}:</p>
            <p className={'mono-title'}>{voucherCode.voucherCode}</p>
        </div>
    )
}
