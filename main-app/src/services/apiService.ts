// API Service - Handles switching between HTTP and Local modes
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

type ApiMode = 'http' | 'local'

class ApiService {
    private mode: ApiMode = 'http'
    private baseUrl = 'http://localhost:3001'

    constructor() {
        // Load mode from localStorage if available, otherwise default to http
        this.loadModeFromStorage()
    }

    /**
     * Load API mode from environment variable or localStorage, default to http if not found
     */
    private loadModeFromStorage(): void {
        // Check for environment variable override first
        const envMode = import.meta.env?.VITE_API_MODE as ApiMode
        if (envMode === 'local') {
            this.mode = 'local'
            console.log('API Service mode forced via VITE_API_MODE: local')
            return
        }

        try {
            const storedMode = localStorage.getItem('api_mode') as ApiMode
            if (storedMode && ['http', 'local'].includes(storedMode)) {
                this.mode = storedMode
                console.log(
                    `API Service mode loaded from localStorage: ${storedMode}`
                )
            } else {
                this.mode = 'http'
                console.log('API Service mode defaulted to: http')
            }
        } catch {
            this.mode = 'http'
            console.log(
                'API Service mode defaulted to: http (localStorage unavailable)'
            )
        }
    }

    /**
     * Set the API mode manually and persist to localStorage
     */
    setMode(mode: ApiMode) {
        this.mode = mode
        try {
            localStorage.setItem('api_mode', mode)
            console.log(
                `API Service mode set to: ${mode} (saved to localStorage)`
            )
        } catch {
            console.log(
                `API Service mode set to: ${mode} (localStorage save failed)`
            )
        }
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
     * Check if we should use HTTP mode
     */
    private isHttpMode(): boolean {
        return this.mode === 'http'
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
                // Do nothing
            }
        } catch {
            // Do nothing
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

    /**
     * Local implementation for saveDeviceToken
     * Persists token to localStorage
     */
    private async localSaveDeviceToken(token: string): Promise<boolean> {
        try {
            localStorage.setItem('localapi_vcash_device_token', token)
            console.log('Local saveDeviceToken: token saved to localStorage')
            return true
        } catch (error) {
            console.error('Local saveDeviceToken error:', error)
            return false
        }
    }

    /**
     * Local implementation for getDeviceToken
     * Retrieves token from localStorage
     */
    private async localGetDeviceToken(): Promise<string> {
        try {
            const token =
                localStorage.getItem('localapi_vcash_device_token') || ''
            console.log('Local getDeviceToken: retrieved from localStorage')
            return token
        } catch (error) {
            console.error('Local getDeviceToken error:', error)
            return ''
        }
    }

    /**
     * Local implementation for sendLog
     * Does nothing, just returns success
     */
    private async localSendLog(_: string, __: string): Promise<void> {
        // console.log(`Local sendLog [${level}]: ${message}`)
        // Does nothing in local mode
    }

    /**
     * Local implementation for getCredentials
     * Returns no credentials stored
     */
    private async localGetCredentials(): Promise<DeviceCredentials | null> {
        console.log('Local getCredentials: no credentials stored')
        return null
    }

    /**
     * Local implementation for print
     * Returns success without actually printing
     */
    private async localPrint(imageUrl: string): Promise<ApiResponse> {
        console.log(`Local print: mock print for ${imageUrl}`)
        return {
            success: true,
            message: 'Print successful (local mode)',
            status: { iLogicCode: 0, iPhyCode: 0 }
        }
    }

    /**
     * Local implementation for activate
     * Returns success without actually activating
     */
    private async localActivate(_jwt: string): Promise<ActivateApiResponse> {
        console.log('Local activate: mock activation')
        return {
            activated: true,
            timer_seconds: 300, // 5 minutes mock timer
            expires_at: new Date(Date.now() + 300000).toISOString()
        }
    }

    /**
     * Local implementation for deactivate
     * Returns success without actually deactivating
     */
    private async localDeactivate(): Promise<void> {
        console.log('Local deactivate: mock deactivation')
        // Does nothing in local mode
    }

    // Public API methods that route to appropriate implementation

    async print(imageUrl: string): Promise<ApiResponse> {
        if (this.isHttpMode()) {
            return this.httpPrint(imageUrl)
        }
        return this.localPrint(imageUrl)
    }

    async activate(jwt: string): Promise<ActivateApiResponse> {
        if (this.isHttpMode()) {
            return this.httpActivate(jwt)
        }
        return this.localActivate(jwt)
    }

    async deactivate(): Promise<void> {
        if (this.isHttpMode()) {
            return this.httpDeactivate()
        }
        return this.localDeactivate()
    }

    async saveDeviceToken(token: string): Promise<boolean> {
        if (this.isHttpMode()) {
            return this.httpSaveDeviceToken(token)
        }
        return this.localSaveDeviceToken(token)
    }

    async getDeviceToken(): Promise<string> {
        if (this.isHttpMode()) {
            return this.httpGetDeviceToken()
        }
        return this.localGetDeviceToken()
    }

    async sendLog(level: string, message: string): Promise<void> {
        if (this.isHttpMode()) {
            return this.httpSendLog(level, message)
        }
        return this.localSendLog(level, message)
    }

    async getCredentials(): Promise<DeviceCredentials | null> {
        if (this.isHttpMode()) {
            return this.httpGetCredentials()
        }
        return this.localGetCredentials()
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
