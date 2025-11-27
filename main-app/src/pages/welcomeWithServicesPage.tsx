import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import WelcomeWithServices from '@/components/templates/welcomeWithServicesTemplate/welcomeWithServicesTemplate'
import { useOrder } from '@/providers'
import { startSession } from '@/utilities/sessionHelper'

export default function WelcomeWithServicesPage() {
    const navigate = useNavigate()
    const { setSessionId: saveSessionId } = useOrder()

    useEffect(() => {
        startSession(saveSessionId, navigate)
    }, [navigate, saveSessionId])

    return (
        <div className="welcome-page">
            <WelcomeWithServices navigate={navigate} />
        </div>
    )
}
