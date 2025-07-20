import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { useTranslate } from '@/i18n/useTranslate'

export default function VoucherCode({
    voucherCode,
    voucherConfirmation
}: {
    voucherCode: string
    voucherConfirmation: VoucherConfirmation
}) {
    const { t } = useTranslate()
    return (
        <div className="voucher-code">
            <div className={'separator'} />
            <p className="title-label">VCASH {t('home.code.voucher')}</p>
            <div className={'separator'} />
            {voucherCode && (
                <img
                    className="qr-code"
                    src={`https://vqr-generator.fly.dev/api/vcash-print?data=https://market.vcash.rs?code=${voucherCode}`}
                    alt="QR Code"
                />
            )}
            <div>
                <p className={'activation-code-label'}>
                    {t('home.code.activationCode')}:
                </p>
                <p className={'v-code'}>{voucherCode}</p>
            </div>
            <div className={'separator'} />
            <p className={'v-label'}>{t('voucherValue')}</p>
            <p className={'v-amount'}>
                {voucherConfirmation.amount}
            </p>
            <div className="separator last-separator"></div>
        </div>
    )
}
