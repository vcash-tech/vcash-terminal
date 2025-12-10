import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Welcome from '@/components/templates/welcome/welcomeTemplate'
import { useNavigationContext } from '@/hooks/useNavigationHook'
import { AuthService } from '@/services/authService'
import { POSService } from '@/services/posService'
import { Auth } from '@/types/common/httpRequest'

function HomePage() {
    const navigate = useNavigate()
    const { startUrl } = useNavigationContext()

    useEffect(() => {
        const createSession = async () => {
            try {
                console.log('Attempting to create session...')
                await POSService.createSession()
                console.log(
                    '✅ Session created successfully - redirecting to welcome'
                )
                navigate(startUrl ?? '/welcome')
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
                    // If we have a device token, this is likely a connectivity issue
                    // Navigate to connectivity issues page instead of registration
                    if (AuthService.HasToken(Auth.POS)) {
                        console.error(
                            'Failed to create session with valid device token, redirecting to connectivity issues:',
                            error
                        )
                        navigate('/connectivity-issues')
                    } else {
                        console.error(
                            'Failed to create session, no device token - redirecting to registration:',
                            error
                        )
                        navigate('/register')
                    }
                }
            }
        }

        // Always try to create session on home page load
        createSession()
    }, [navigate, startUrl])

    return <Welcome navigate={navigate} />
}

export default HomePage
