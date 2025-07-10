import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { POSService } from '@/services/posService'

import Welcome from '../components/templates/welcome/welcomeTemplate'

export default function WelcomePage() {
    const navigate = useNavigate()

    useEffect(() => {
        const ensureSession = async () => {
            try {
                console.log(
                    'Welcome page - attempting to create/verify session...'
                )
                await POSService.createSession()
                console.log('✅ Session verified successfully on welcome page')
            } catch (error) {
                console.error(
                    'Failed to create session on welcome page, redirecting to registration:',
                    error
                )
                navigate('/register')
            }
        }

        ensureSession()
    }, [navigate])

    return (
        <div className="welcome-page">
            <Welcome navigate={navigate} />
        </div>
    )
}
