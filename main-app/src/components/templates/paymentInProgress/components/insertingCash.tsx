import { insertCashImg } from '@/assets/images'
import BetWarningBanner from '@/components/atoms/betWarningBanner/betWarningBanner'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AcceptedBills from '@/components/molecules/acceptedBills/acceptedBills'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'

export type InsertingCashProps = {
    amount: number
    onProcessPayment: () => void
    onUsePreviousVoucher: () => void
    canUsePreviousVoucher: boolean
    amountByDraftDepositType?: Record<string, number>
}

export default function InsertingCash({
    amount,
    onProcessPayment,
    onUsePreviousVoucher,
    canUsePreviousVoucher,
    amountByDraftDepositType
}: InsertingCashProps) {
    const { t } = useTranslate()
    const { state } = useOrder()
    const isGaming = state.voucherType === 'gaming'

    // Check if only PROMO_VOUCHER type is present in the draft deposit
    const hasOnlyPromoVoucher = (() => {
        if (!amountByDraftDepositType) return false
        const types = Object.keys(amountByDraftDepositType)
        return types.length === 1 && types[0] === 'PROMO_VOUCHER'
    })()

    return (
        <div className="insert-cash">
            {!isGaming && <BetWarningBanner className="insert-cash-position" />}
            <h1>{t('insertCash.title')}</h1>
            <h3>
                {t('insertCash.subtitle1')}{' '}
                <span>{isGaming ? '200 RSD' : '500 RSD'}</span>{' '}
                {t('insertCash.subtitle2')} <span>100.000 RSD</span>{' '}
            </h3>
            <AcceptedBills />
            <div className="demo-wrapper">
                <img src={insertCashImg} alt={t('insertCash.altText')} />
            </div>
            <div className="amount-wrapper">
                {hasOnlyPromoVoucher && (
                    <div className="promo-voucher-warning">
                        <p>{t('insertCash.promoVoucherWarning')}</p>
                    </div>
                )}
                {canUsePreviousVoucher && (
                    <>
                        <button
                            className="previous-voucher-button"
                            onClick={onUsePreviousVoucher}>
                            {t('insertCash.usePreviousVoucher')}
                        </button>
                        <span className="plus-sign">+</span>
                    </>
                )}
                <div className="inserted-amount">
                    {t('insertCash.insertedAmount')}:
                    <span>
                        {amount.toFixed(2) || '0.00'}{' '}
                        <span className="currency">RSD</span>
                    </span>
                </div>
                {/* {amount > 80000 ? (
                    <div className="progress-to-full-wrapper">
                        <div
                            className="progress-to-full"
                            data-progress-text={t('insertCash.progressText', {
                                amount: 100000 - amount
                            })}>
                            <progress value={amount} max={100000} />
                        </div>
                    </div>
                ) : null} */}
            </div>
            <div className="buttons-wrapper">
                <PrimaryButton
                    isDisabled={!amount || amount < (isGaming ? 200 : 500)}
                    text={
                        amount < (isGaming ? 200 : 500)
                            ? t('insertCash.minAmount') +
                              ' ' +
                              (isGaming ? '200 RSD' : '500 RSD')
                            : t('insertCash.confirmPayment')
                    }
                    callback={onProcessPayment}
                />
            </div>
        </div>
    )
}
