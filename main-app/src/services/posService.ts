import { Auth } from '../types/common/httpRequest'
import {
    AgentPOSInfo,
    CashierTokenRequest,
    CashierTokenResponse
} from '../types/pos/cashier'
import {
    DeviceCodeEmailRequest,
    DeviceCodeResponse,
    DeviceCodeUsernameRequest,
    DeviceTokenRequest,
    DeviceTokenResponse
} from '../types/pos/deviceAuth'
import { AuthService } from './authService'
import { HttpService } from './httpService'
import { MockApiService } from './mockApiService'

const api = {
    generateDeviceCodeEmail: '/auth/device/code/email',
    generateDeviceCodeUsername: '/auth/device/code/username',
    generateDeviceToken: '/auth/device/token',
    getCashiersPOS: '/auth/cashier/all',
    unlockDevice: '/auth/cashier/token'
}

const isDev = import.meta.env.DEV === true
// Set this to true to use mock responses in development mode
const useMockApi = import.meta.env.VITE_SHOULD_MOCK_API === 'true' && isDev

export class POSService {
    // Device Registration
    static async generateDeviceCodeEmail(
        dto: DeviceCodeEmailRequest
    ): Promise<DeviceCodeResponse> {
        if (useMockApi) {
            console.log('Using mock response for generateDeviceCodeEmail')
            return MockApiService.generateDeviceCodeResponse()
        }

        const response = await HttpService.Post<DeviceCodeResponse>(
            api.generateDeviceCodeEmail,
            dto
        )
        return response
    }

    static async generateDeviceCodeUsername(
        dto: DeviceCodeUsernameRequest
    ): Promise<DeviceCodeResponse> {
        if (useMockApi) {
            console.log('Using mock response for generateDeviceCodeUsername')
            return MockApiService.generateDeviceCodeResponse()
        }

        const response = await HttpService.Post<DeviceCodeResponse>(
            api.generateDeviceCodeUsername,
            dto
        )
        return response
    }

    static async generateDeviceToken(
        dto: DeviceTokenRequest
    ): Promise<DeviceTokenResponse> {
        if (useMockApi) {
            console.log('Using mock response for generateDeviceToken')
            return MockApiService.generateDeviceTokenResponse()
        }

        const response = await HttpService.Post<DeviceTokenResponse>(
            api.generateDeviceToken,
            dto
        )
        return response
    }

    // Session creation - creates session token if needed
    static async createSession(): Promise<string | null> {
        try {
            // Check if we already have a valid session token
            if (AuthService.HasToken(Auth.Cashier)) {
                console.log('✅ Session token already exists')

                return AuthService.GetToken(Auth.Cashier)
            }

            console.log('Creating new session token...')

            // Fetch cashiers
            const cashiersResponse = await POSService.getCashiersPOS()

            // Find the first cashier with a fixed pin
            const firstWithFixedPin = cashiersResponse?.cashiers?.find(
                (cashier) => !!cashier.fixedPin
            )

            if (!firstWithFixedPin) {
                throw new Error(
                    'No cashier with fixed pin found for auto-unlock'
                )
            }

            // Unlock device with the found cashier credentials
            const response = await POSService.unlockDevice({
                userName: firstWithFixedPin.userName || '',
                pin: firstWithFixedPin.fixedPin || ''
            })

            // Save the session token
            AuthService.SetToken(Auth.Cashier, response.accessToken)
            console.log('✅ Session token created successfully')

            return response.accessToken
        } catch (error) {
            console.error('❌ Error creating session token:', error)
            // Clear any partial session token
            AuthService.DeleteToken(Auth.Cashier)
            throw error // Re-throw so caller can handle navigation
        }
    }

    // Force recreate session - always creates a new session token
    // Used when starting a new flow to ensure fresh session
    static async forceRecreateSession(): Promise<string | null> {
        console.log('🔄 Force recreating session token...')

        // Delete existing session token first
        AuthService.DeleteToken(Auth.Cashier)

        // Now create a new session
        return POSService.createSession()
    }

    // Cashier Locked Screen
    static async getCashiersPOS(): Promise<AgentPOSInfo> {
        if (useMockApi) {
            console.log('Using mock response for getCashiersPOS')
            return MockApiService.getCashiersPOSResponse()
        }

        const response = await HttpService.Get<AgentPOSInfo>(
            api.getCashiersPOS,
            Auth.POS
        )
        return response
    }

    static async unlockDevice(
        dto: CashierTokenRequest
    ): Promise<CashierTokenResponse> {
        if (useMockApi) {
            console.log('Using mock response for unlockDevice')
            return MockApiService.unlockDeviceResponse()
        }

        const response = await HttpService.Post<CashierTokenResponse>(
            api.unlockDevice,
            dto,
            Auth.POS
        )
        return response
    }
}
