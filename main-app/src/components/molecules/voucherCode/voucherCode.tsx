import QRCode from 'react-qr-code'

import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { useTranslate } from '@/i18n/useTranslate'

export default function VoucherCode({
    voucherCode
}: {
    voucherCode: VoucherConfirmation
}) {
    const { t } = useTranslate()
    const formatAmount = (amount: string) => {
        return amount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    return (
        <div className="voucher-code">
            <div className={'separator'} />
            <p className="title-label">VCASH {t('home.code.voucher')}</p>
            {/*<p className="mono">{t('home.code.scan')}:</p>*/}
            <div className={'separator'} />
            {voucherCode.qrCodeData && (
                <QRCode
                    value={voucherCode.qrCodeData}
                    size={200}
                    className="qr-code"
                />
            )}
            {/*<p*/}
            {/*    className={''}*/}
            {/*    dangerouslySetInnerHTML={{ __html: t('home.code.siteLink') }}*/}
            {/*/>*/}
            <div>
                <p className={'activation-code-label'}>
                    {t('home.code.activationCode')}:
                </p>
                <p className={'v-code'}>{voucherCode.voucherCode}</p>
            </div>
            <div className={'separator'} />
            <p className={'v-label'}>{t('voucherValue')}</p>
            <p className={'v-amount'}>{formatAmount(voucherCode.amount)}</p>
            <div className="separator last-separator"></div>
        </div>
    )
}
