import { Auth } from '../types/common/httpRequest'
import { apiService } from './apiService'

/**
 * Device Token Service
 * Handles device token persistence between localStorage and apiService
 * Loads once at startup, saves once after registration
 */
class DeviceTokenService {
    private initialized = false

    /**
     * Initialize device token from persistent storage
     * Should be called once at app startup
     * Always validates localStorage against persistent storage
     */
    async initialize(): Promise<void> {
        if (this.initialized) return

        try {
            // Always check persistent storage first to validate localStorage
            console.log('Loading device token from persistent storage...')
            const deviceToken = await apiService.getDeviceToken()

            if (deviceToken) {
                // Valid token found in persistent storage
                localStorage.setItem(`${Auth.POS}_token`, deviceToken)
                console.log(
                    'Device token loaded from persistent storage and stored in localStorage'
                )
            } else {
                // No token in persistent storage - keep localStorage as-is
                // Device token should never be cleared programmatically
                console.log(
                    'No device token found in persistent storage, keeping localStorage intact'
                )
            }
        } catch (error) {
            // API failed - keep localStorage as-is to handle flaky connections
            // Device token should never be cleared programmatically
            console.warn(
                'Error loading device token from persistent storage, keeping localStorage intact:',
                error
            )
        } finally {
            this.initialized = true
        }
    }

    /**
     * Save device token to both localStorage and persistent storage
     * Should be called after successful device registration
     */
    async saveDeviceToken(token: string): Promise<boolean> {
        try {
            // Save to localStorage immediately for synchronous access
            localStorage.setItem(`${Auth.POS}_token`, token)

            // Save to persistent storage via apiService
            const success = await apiService.saveDeviceToken(token)

            if (success) {
                console.log('Device token saved to persistent storage')
            } else {
                console.warn(
                    'Failed to save device token to persistent storage'
                )
            }

            return success
        } catch (error) {
            console.error('Error saving device token:', error)
            return false
        }
    }

    /**
     * Check if device token service has been initialized
     */
    isInitialized(): boolean {
        return this.initialized
    }
}

// Create singleton instance
export const deviceTokenService = new DeviceTokenService()
