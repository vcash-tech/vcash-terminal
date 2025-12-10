import { NavigateFunction } from 'react-router-dom'

import { AuthService } from '@/services/authService'
import { POSService } from '@/services/posService'
import { Auth } from '@/types/common/httpRequest'

export const startSession = async (
    onSave: (sessionId: string) => void,
    navigate: NavigateFunction
) => {
    try {
        console.log('Welcome page - attempting to create/verify session...')
        const sessionId = await POSService.createSession()
        if (sessionId) {
            onSave(sessionId)
        }
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
            // If we have a device token, this is likely a connectivity issue
            // Navigate to connectivity issues page instead of registration
            if (AuthService.HasToken(Auth.POS)) {
                console.error(
                    'Failed to create session on welcome page with valid device token, redirecting to connectivity issues:',
                    error
                )
                navigate('/connectivity-issues')
            } else {
                console.error(
                    'Failed to create session on welcome page, no device token - redirecting to registration:',
                    error
                )
                navigate('/register')
            }
        }
    }
}
