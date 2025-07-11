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
            className={`payment-card ${isDisabled ? 'coming-soon' : ''}`}
            disabled={isDisabled}>
            <p className="card-text">
                {text}
            </p>
            <div className="card-image">
                <img src={image} alt={text} />
            </div>
        </button>
    )
}
