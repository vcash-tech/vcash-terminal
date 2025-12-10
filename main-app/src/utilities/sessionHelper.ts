import { NavigateFunction } from 'react-router-dom'
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid'

import { AuthService } from '@/services/authService'
import { POSService } from '@/services/posService'
import { Auth } from '@/types/common/httpRequest'

/**
 * Generates a globally unique session ID with embedded timestamp.
 * Uses UUIDv7 which includes timestamp information in the UUID itself.
 * Format: UUIDv7 string (e.g., "018d3f85-6f3a-7000-8000-123456789abc")
 * The timestamp is embedded in the first part of the UUID.
 *
 * Fallback: If UUIDv7 is not available, uses UUIDv4 with appended Unix timestamp.
 */
export const generateSessionId = (): string => {
    try {
        // Use UUIDv7 (timestamp-based, available in uuid v11+)
        return uuidv7()
    } catch (error) {
        // Fallback: UUIDv4 with appended Unix timestamp
        console.warn('UUIDv7 not available, using fallback', error)
        const timestamp = Date.now()
        return `${uuidv4()}-${timestamp}`
    }
}

/**
 * Verifies or creates cashier JWT authentication token.
 * Note: This is separate from the order session ID (UUIDv7).
 * The JWT is for API authentication, while sessionId tracks user order sessions.
 */
export const verifyCashierAuth = async (navigate: NavigateFunction) => {
    try {
        console.log(
            'Welcome page - attempting to verify cashier authentication...'
        )
        // This creates/verifies the JWT token for API authentication
        await POSService.createSession()
        console.log(
            '✅ Cashier authentication verified successfully on welcome page'
        )
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
