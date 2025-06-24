import { useNavigate } from 'react-router-dom'

import Welcome from '../components/templates/welcome/welcomeTemplate'

export default function WelcomePage() {
    const navigate = useNavigate()
    return (
        <div className="welcome-page">
            <Welcome navigate={navigate} />
        </div>
    )
}
