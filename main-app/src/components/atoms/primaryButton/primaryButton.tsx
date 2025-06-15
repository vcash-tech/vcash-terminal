export default function PrimaryButton({ text, callback, inverted }: { text: string; callback?: () => void; inverted?: boolean }) {
    return (
        <button className={`primary-button ${inverted ? 'inverted' : ''}`}  onClick={callback}>
            <span>{text}</span>
        </button>
    );
}