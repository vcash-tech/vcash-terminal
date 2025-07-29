import { useNavigate } from 'react-router-dom'

import { angleLeft } from '../../../assets/icons'

export default function LinkBackButton({
    buttonText,
    buttonUrl
}: {
    buttonText: string
    buttonUrl: string
}) {
    const navigate = useNavigate()

    const navigateToUrl = () => {
        navigate(buttonUrl)
    }

    return (
        <button className="link-back-button" onClick={navigateToUrl}>
            <img className="link-back-ico" alt={buttonText} src={angleLeft} />
            <span className="link-back-text">{buttonText}</span>
        </button>
    )
}
