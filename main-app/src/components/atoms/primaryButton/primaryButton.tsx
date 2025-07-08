export default function PrimaryButton({
    text,
    callback,
    onPress,
    inverted
}: {
    text: string
    callback?: () => void
    inverted?: boolean
    onPress?: () => void
}) {
    return (
        <button
            className={`primary-button ${inverted ? 'inverted' : ''}`}
            onClick={callback || onPress}>
            <span>{text}</span>
        </button>
    )
}
