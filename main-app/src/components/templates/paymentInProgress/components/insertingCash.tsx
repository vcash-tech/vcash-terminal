import { insertCashImg } from '@/assets/images'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AcceptedBills from '@/components/molecules/acceptedBills/acceptedBills'
import { useTranslate } from '@/i18n/useTranslate'

export type InsertingCashProps = {
    amount: number
    onProcessPayment: () => void
    onUsePreviousVoucher: () => void
}

export default function InsertingCash({
    amount,
    onProcessPayment,
    onUsePreviousVoucher
}: InsertingCashProps) {
    const { t } = useTranslate()

    return (
        <div className="insert-cash">
            <h1>{t('insertCash.title')}</h1>
            <AcceptedBills />
            <div className="demo-wrapper">
                <img src={insertCashImg} alt={t('insertCash.altText')} />
            </div>
            <div className="inserted-amount">
                {t('insertCash.insertedAmount')}:<span>{amount || 0} RSD</span>
            </div>
            {amount > 80000 ? (
                <div className="progress-to-full-wrapper">
                    <div
                        className="progress-to-full"
                        data-progress-text={t('insertCash.progressText', {
                            amount: 100000 - amount
                        })}>
                        <progress value={amount} max={100000} />
                    </div>
                </div>
            ) : null}
            <div className="buttons-wrapper">
                <PrimaryButton
                    isDisabled={!amount || amount <= 0}
                    text={t('insertCash.confirmPayment')}
                    callback={onProcessPayment}
                />
                <PrimaryButton
                    text={t('insertCash.usePreviousVoucher')}
                    callback={onUsePreviousVoucher}
                />
            </div>
        </div>
    )
}
