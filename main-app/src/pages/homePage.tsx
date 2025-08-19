import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Welcome from '@/components/templates/welcome/welcomeTemplate'
import { useNavigationContext } from '@/hooks/useNavigationHook'
import { POSService } from '@/services/posService'

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
                    console.error(
                        'Failed to create session, redirecting to registration:',
                        error
                    )
                    navigate('/register')
                }
            }
        }

        // Always try to create session on home page load
        createSession()
    }, [navigate, startUrl])

    return <Welcome navigate={navigate} />
}

export default HomePage
