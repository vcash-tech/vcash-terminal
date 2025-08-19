import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import WelcomeWithServices from '@/components/templates/welcomeWithServicesTemplate/welcomeWithServicesTemplate'
import { POSService } from '@/services/posService'

export default function WelcomeWithServicesPage() {
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
                // Check if error requires specific navigation
                if (
                    error &&
                    typeof error === 'object' &&
                    'requiresNavigation' in error
                ) {
                    const navigationError = error as {
                        requiresNavigation: string
                    }
                    console.log(
                        '🔄 API error requires navigation to:',
                        navigationError.requiresNavigation
                    )
                    navigate(navigationError.requiresNavigation)
                } else {
                    console.error(
                        'Failed to create session on welcome page, redirecting to registration:',
                        error
                    )
                    navigate('/register')
                }
            }
        }

        ensureSession()
    }, [navigate])

    return (
        <div className="welcome-page">
            <WelcomeWithServices navigate={navigate} />
        </div>
    )
}
