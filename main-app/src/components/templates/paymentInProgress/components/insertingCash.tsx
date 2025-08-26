import { insertCashImg } from '@/assets/images'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AcceptedBills from '@/components/molecules/acceptedBills/acceptedBills'
import { useTranslate } from '@/i18n/useTranslate'

export type InsertingCashProps = {
    amount: number
    onProcessPayment: () => void
}

export default function InsertingCash({
    amount,
    onProcessPayment
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
            <PrimaryButton
                isDisabled={!amount || amount <= 0}
                text={t('insertCash.confirmPayment')}
                callback={onProcessPayment}
            />
        </div>
    )
}
