import { NavigateFunction } from 'react-router-dom'

import { POSService } from '@/services/posService'

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
            console.error(
                'Failed to create session on welcome page, redirecting to registration:',
                error
            )
            navigate('/register')
        }
    }
}