import { useTranslate } from '@/i18n/useTranslate'

export default function PaymentCard({
    image,
    text,
    callback,
    isDisabled
}: {
    image: string
    text: string
    isDisabled?: boolean
    callback: () => void
}) {
    const { t } = useTranslate()

    return (
        <button
            onClick={callback}
            className={`payment-card ${isDisabled ? 'coming-soon' : ''}`}
            disabled={isDisabled}>
            <p className="card-text">
                {isDisabled && <span>{t('comingSoon')}</span>}
                <br />
                {text}
            </p>
            <div className="card-image">
                <img src={image} alt={text} />
            </div>
        </button>
    )
}
