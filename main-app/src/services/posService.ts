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

console.log('useMockApi', useMockApi, import.meta.env.VITE_SHOULD_MOCK_API)

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

    // Session creation after device registration
    static async createSession(): Promise<void> {
        try {
            console.log('Creating session after device registration...')

            // Fetch cashiers
            const cashiersResponse = await POSService.getCashiersPOS()

            // Find the first cashier with a fixed pin
            const firstWithFixedPin = cashiersResponse?.cashiers?.find(
                (cashier) => !!cashier.fixedPin
            )

            if (firstWithFixedPin) {
                // Unlock device with the found cashier credentials
                const response = await POSService.unlockDevice({
                    userName: firstWithFixedPin.userName || '',
                    pin: firstWithFixedPin.fixedPin || ''
                })

                // Save the session token
                AuthService.SetToken(Auth.Cashier, response.accessToken)
                console.log(
                    'Session created successfully after device registration'
                )
            } else {
                console.warn('No cashier with fixed pin found for auto-unlock')
            }
        } catch (error) {
            console.error(
                'Error creating session after device registration:',
                error
            )
            // Don't throw error to avoid breaking the registration flow
        }
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
