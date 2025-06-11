export default function PrimaryButton({ inverted }: { inverted?: boolean }) {
    return (
        <button className={`primary-button ${inverted ? 'inverted' : ''}`}>
            <span>Primary Button</span>
        </button>
    );
}