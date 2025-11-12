import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOrder } from '@/providers'
import { verifyCashierAuth } from '@/utilities/sessionHelper'

import Welcome from '../components/templates/welcome/welcomeTemplate'

export default function WelcomePage() {
    const navigate = useNavigate()
    const { state } = useOrder()

    useEffect(() => {
        verifyCashierAuth(navigate)
    }, [navigate])

    console.log('sessionId', state.sessionId)

    return (
        <div className="welcome-page">
            <Welcome navigate={navigate} />
        </div>
    )
}
