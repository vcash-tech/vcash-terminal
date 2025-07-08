export default function PrimaryButton({
    text,
    callback,
    onPress,
    inverted,
    isDisabled,
}: {
    text: string
    callback?: () => void
    inverted?: boolean
    onPress?: () => void
    isDisabled?: boolean
}) {
    return (
        <button
            disabled={isDisabled}
            className={`primary-button ${inverted ? 'inverted' : ''}`}
            onClick={callback || onPress}>
            <span>{text}</span>
        </button>
    )
}
