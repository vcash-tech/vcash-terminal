import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOrder } from '@/providers'
import { startSession } from '@/utilities/sessionHelper'

import Welcome from '../components/templates/welcome/welcomeTemplate'

export default function WelcomePage() {
    const navigate = useNavigate()
    const { setSessionId: saveSessionId, state } = useOrder()

    useEffect(() => {
        startSession(saveSessionId, navigate)
    }, [navigate, saveSessionId])

    console.log('sessionId', state.sessionId)

    return (
        <div className="welcome-page">
            <Welcome navigate={navigate} />
        </div>
    )
}
