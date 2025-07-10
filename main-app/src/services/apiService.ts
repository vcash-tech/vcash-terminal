// API Service - Handles switching between Electron and HTTP modes
interface ApiResponse {
    success: boolean
    message: string
    status: {
        iLogicCode: number
        iPhyCode: number
    }
}

interface ActivateApiResponse {
    activated: boolean
    timer_seconds: number
    expires_at: string
}

interface DeviceTokenResponse {
    success: boolean
    token?: string
    exists?: boolean
    timestamp: string
}

interface LogResponse {
    success: boolean
    message: string
    timestamp: string
}

interface SaveTokenResponse {
    success: boolean
    message: string
    timestamp: string
}

interface DeviceCredentials {
    email: string
    device_name: string
}

interface CredentialsResponse {
    success: boolean
    credentials: DeviceCredentials | Record<string, never>
    exists: boolean
    timestamp: string
}

type ApiMode = 'electron' | 'http' | 'auto'

class ApiService {
    private mode: ApiMode = 'auto'
    private baseUrl = 'http://localhost:3001'

    constructor() {
        // Auto-detect environment on initialization
        this.detectEnvironment()
    }

    /**
     * Set the API mode manually
     */
    setMode(mode: ApiMode) {
        this.mode = mode
        console.log(`API Service mode set to: ${mode}`)
    }

    /**
     * Get current API mode
     */
    getMode(): ApiMode {
        return this.mode
    }

    /**
     * Set the base URL for HTTP mode
     */
    setBaseUrl(url: string) {
        this.baseUrl = url
        console.log(`API Service base URL set to: ${url}`)
    }

    /**
     * Get current base URL
     */
    getBaseUrl(): string {
        return this.baseUrl
    }

    /**
     * Detect if we're running in Electron or browser
     */
    private detectEnvironment(): void {
        if (this.mode !== 'auto') return

        // Check for environment variable override
        const forceMode = import.meta.env?.VITE_API_MODE as ApiMode
        if (forceMode && ['electron', 'http'].includes(forceMode)) {
            this.mode = forceMode
            console.log(
                `API Service mode forced via VITE_API_MODE: ${forceMode}`
            )
            return
        }

        // Auto-detect based on window.api availability
        const isElectron = !!(window && window.api)
        this.mode = isElectron ? 'electron' : 'http'
        console.log(`API Service auto-detected mode: ${this.mode}`)
    }

    /**
     * Check if Electron API is available and we should use it
     */
    private isElectronMode(): boolean {
        return this.mode === 'electron' && !!(window && window.api)
    }

    /**
     * HTTP implementation for saveDeviceToken
     */
    private async httpSaveDeviceToken(token: string): Promise<boolean> {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/device/save-token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                }
            )

            const data: SaveTokenResponse = await response.json()
            return data.success
        } catch (error) {
            console.error('HTTP saveDeviceToken error:', error)
            return false
        }
    }

    /**
     * HTTP implementation for getDeviceToken
     */
    private async httpGetDeviceToken(): Promise<string> {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/device/get-token`
            )
            const data: DeviceTokenResponse = await response.json()

            if (data.success && data.token) {
                return data.token
            }
            return ''
        } catch (error) {
            console.error('HTTP getDeviceToken error:', error)
            return ''
        }
    }

    /**
     * HTTP implementation for sendLog
     */
    private async httpSendLog(level: string, message: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/device/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ level, message })
            })

            const data: LogResponse = await response.json()
            if (!data.success) {
                console.error('HTTP sendLog failed:', data.message)
            }
        } catch (error) {
            console.error('HTTP sendLog error:', error)
        }
    }

    /**
     * HTTP implementation for getCredentials
     */
    private async httpGetCredentials(): Promise<DeviceCredentials | null> {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/device/get-credentials`
            )
            const data: CredentialsResponse = await response.json()

            if (
                data.success &&
                data.exists &&
                data.credentials &&
                'email' in data.credentials
            ) {
                return data.credentials as DeviceCredentials
            }
            return null
        } catch (error) {
            console.error('HTTP getCredentials error:', error)
            return null
        }
    }

    /**
     * HTTP implementation for print
     * Passes image URL to localhost service which handles download and conversion
     */
    private async httpPrint(imageUrl: string): Promise<ApiResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/printer/print-image`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ file: imageUrl })
                }
            )

            const data = await response.json()
            return data
        } catch (error) {
            console.error('HTTP print error:', error)
            return {
                success: false,
                message: `Print failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                status: { iLogicCode: -1, iPhyCode: -1 }
            }
        }
    }

    /**
     * HTTP implementation for activate
     */
    private async httpActivate(jwt: string): Promise<ActivateApiResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/bill-acceptor/activate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: jwt })
                }
            )

            const data = await response.json()
            return data
        } catch (error) {
            console.error('HTTP activate error:', error)
            return {
                activated: false,
                timer_seconds: 0,
                expires_at: ''
            }
        }
    }

    /**
     * HTTP implementation for deactivate
     */
    private async httpDeactivate(): Promise<void> {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/bill-acceptor/deactivate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (!response.ok) {
                throw new Error('Failed to deactivate')
            }
        } catch (error) {
            console.error('HTTP deactivate error:', error)
        }
    }

    // Public API methods that route to appropriate implementation

    async print(imageUrl: string): Promise<ApiResponse> {
        if (this.isElectronMode()) {
            return window.api.print(imageUrl)
        }
        return this.httpPrint(imageUrl)
    }

    async activate(jwt: string): Promise<ActivateApiResponse> {
        if (this.isElectronMode()) {
            return window.api.activate(jwt)
        }
        return this.httpActivate(jwt)
    }

    async deactivate(): Promise<void> {
        if (this.isElectronMode()) {
            return window.api.deactivate()
        }
        return this.httpDeactivate()
    }

    async saveDeviceToken(token: string): Promise<boolean> {
        if (this.isElectronMode()) {
            return window.api.saveDeviceToken(token)
        }
        return this.httpSaveDeviceToken(token)
    }

    async getDeviceToken(): Promise<string> {
        if (this.isElectronMode()) {
            return window.api.getDeviceToken()
        }
        return this.httpGetDeviceToken()
    }

    async sendLog(level: string, message: string): Promise<void> {
        if (this.isElectronMode()) {
            return window.api.sendLog(level, message)
        }
        return this.httpSendLog(level, message)
    }

    async getCredentials(): Promise<DeviceCredentials | null> {
        // Credentials are only available in HTTP mode (browser)
        // In Electron mode, act as if credentials don't exist
        if (this.isElectronMode()) {
            return null
        }
        return this.httpGetCredentials()
    }
}

// Create singleton instance
export const apiService = new ApiService()

// Development helper - expose to window for debugging
if (import.meta.env.DEV) {
    ;(window as unknown as { apiService: ApiService }).apiService = apiService
}

// Export types for external use
export type { ActivateApiResponse, ApiMode, ApiResponse, DeviceCredentials }
