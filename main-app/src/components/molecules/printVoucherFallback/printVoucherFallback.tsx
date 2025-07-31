import WireButton from "@/components/atoms/wireButton/wireButton"
import { useTranslate } from "@/i18n/useTranslate"

export interface PrintVoucherFallbackProps {
    onPrimaryButtonClick: () => void
}

export default function PrintVoucherFallback({
    onPrimaryButtonClick
}: PrintVoucherFallbackProps) {
    const { t } = useTranslate()
    return (
        <div className="print-voucher-fallback">
            <div className="fallback">
                <div>
                    <p>{t('paymentSuccessful.fallbackTitle')}</p>
                    <p>{t('paymentSuccessful.voucherUnavailable')}</p>
                </div>
                <WireButton onClick={onPrimaryButtonClick}>
                    {t('paymentSuccessful.buttonText')}
                </WireButton>
            </div>
        </div>
    )
}
