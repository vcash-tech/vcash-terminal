import { helpIcon } from '@/assets/images'

export type HelpButtonProps = {
    onPress: () => void
}

export default function HelpButton({ onPress }: HelpButtonProps) {
    return (
        <button className="help-button" onClick={onPress}>
            <img src={helpIcon} alt="help" />
        </button>
    )
}