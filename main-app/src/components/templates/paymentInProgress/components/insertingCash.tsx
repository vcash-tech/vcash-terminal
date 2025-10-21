import { insertCashImg } from '@/assets/images'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AcceptedBills from '@/components/molecules/acceptedBills/acceptedBills'
import { useTranslate } from '@/i18n/useTranslate'

export type InsertingCashProps = {
    amount: number
    onProcessPayment: () => void
    onUsePreviousVoucher: () => void
    canUsePreviousVoucher: boolean
}

export default function InsertingCash({
    amount,
    onProcessPayment,
    onUsePreviousVoucher,
    canUsePreviousVoucher
}: InsertingCashProps) {
    const { t } = useTranslate()

    return (
        <div className="insert-cash">
            <h1>{t('insertCash.title')}</h1>
            <h3>
                {t('insertCash.subtitle1')} <span>500 RSD</span>{' '}
                {t('insertCash.subtitle2')} <span>100.000 RSD</span>{' '}
            </h3>
            <AcceptedBills />
            <div className="demo-wrapper">
                <img src={insertCashImg} alt={t('insertCash.altText')} />
            </div>
            <div className="amount-wrapper">
                {canUsePreviousVoucher && (
                    <>
                        <button
                            className="previous-voucher-button"
                            onClick={onUsePreviousVoucher}>
                            Prenesi kusur sa starog vaučera
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
                    isDisabled={!amount || amount <= 0}
                    text={t('insertCash.confirmPayment')}
                    callback={onProcessPayment}
                />
            </div>
        </div>
    )
}
