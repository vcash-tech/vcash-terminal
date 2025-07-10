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
     */
    async initialize(): Promise<void> {
        if (this.initialized) return

        try {
            // Check if we already have a device token in localStorage
            const existingToken = localStorage.getItem(`${Auth.POS}_token`)
            if (existingToken) {
                console.log('Device token already exists in localStorage')
                this.initialized = true
                return
            }

            // Try to load device token from apiService
            console.log('Loading device token from persistent storage...')
            const deviceToken = await apiService.getDeviceToken()

            if (deviceToken) {
                // Store in localStorage for synchronous access
                localStorage.setItem(`${Auth.POS}_token`, deviceToken)
                console.log('Device token loaded from persistent storage')
            } else {
                console.log('No device token found in persistent storage')
            }
        } catch (error) {
            console.error('Error loading device token:', error)
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
