import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import WelcomeWithServices from '@/components/templates/welcomeWithServicesTemplate/welcomeWithServicesTemplate'
import { verifyCashierAuth } from '@/utilities/sessionHelper'

export default function WelcomeWithServicesPage() {
    const navigate = useNavigate()

    useEffect(() => {
        verifyCashierAuth(navigate)
    }, [navigate])

    return (
        <div className="welcome-page">
            <WelcomeWithServices navigate={navigate} />
        </div>
    )
}
