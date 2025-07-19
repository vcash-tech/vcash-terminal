import i18n from "@/i18n/i18n"

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

    return (
        <button
            onClick={callback}
            className={`payment-card ${isDisabled ? 'coming-soon' : ''} ${i18n.language}`}
            disabled={isDisabled}>
            <p className="card-text">
                {isDisabled ? <span>{i18n.language === 'en' ? 'Comming Soon' : 'Uskoro'}<br /></span> : ''}
                {text}
            </p>
            <div className="card-image">
                <img src={image} alt={text} />
            </div>
        </button>
    )
}
