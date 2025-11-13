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

interface QrScannerSuccessResponse {
    success: true
    status: string
    message: string
    operation: string
    data: {
        content: string
        length: number
        scan_duration_ms: number
    }
    device_type: string
    timestamp: string
}

interface QrScannerErrorResponse {
    error: string
    message: string
    timestamp: string
}

interface PosStatusResponse {
    success: boolean
    message: string | null
    errorCode: string | null
    device: string
    device_type: string
    data:
        | {
              status: string
              terminalId: string
              configuration: {
                  timeout: number
                  currency: string
              }
          }
        | Record<string, never>
    timestamp: string
}

interface PosActivateRequest {
    amount: string
    terminalId: string
    jwt_token: string
    currency: string
    voucher_type_id: string
    depositTypeId: string
}

interface PosActivateSuccessResponse {
    success: true
    message: string
    errorCode: null
    device: string
    device_type: string
    sequenceNumber: string
    transactionNumber: string
    deviceDraftDepositId: string
    amount: string
    terminalId: string
    traceId: string
    data: {
        TerminalID: string
        CardIssuer: string
        AID: string
        CardApplicationName: string
        CardNumber: string
        TransactionType: string
        InvoiceNumber: string
        TransactionDate: string
        TransactionTime: string
        RRN: string
        ApprovalCode: string
        ResponseCode: string
        TransactionStatus: string
        Amount: string
        EMVData: string
        InstallmentsNumber: string
        SignatureLine: string
    }
    timestamp: string
}

interface PosActivateErrorResponse {
    success: false
    message: string
    errorCode: string
    device: string
    device_type: string
    data: Record<string, unknown>
    timestamp: string
}

type PosActivateResponse = PosActivateSuccessResponse | PosActivateErrorResponse

class QrScannerTimeoutError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'QrScannerTimeoutError'
    }
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
    private async httpSaveDeviceToken(
        token: string,
        sessionId?: string
    ): Promise<boolean> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/device/save-token`,
                {
                    method: 'POST',
                    headers,
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
    private async httpGetDeviceToken(sessionId?: string): Promise<string> {
        try {
            const headers: Record<string, string> = {}
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/device/get-token`,
                { headers }
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
    private async httpSendLog(
        level: string,
        message: string,
        sessionId?: string
    ): Promise<void> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(`${this.baseUrl}/api/v1/device/log`, {
                method: 'POST',
                headers,
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
    private async httpGetCredentials(
        sessionId?: string
    ): Promise<DeviceCredentials | null> {
        try {
            const headers: Record<string, string> = {}
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/device/get-credentials`,
                { headers }
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
    private async httpPrint(
        imageUrl: string,
        sessionId?: string
    ): Promise<ApiResponse> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/printer/print-image`,
                {
                    method: 'POST',
                    headers,
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
    private async httpActivate(
        jwt: string,
        voucherTypeId: string,
        sessionId?: string
    ): Promise<ActivateApiResponse> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/bill-acceptor/activate`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        token: jwt,
                        voucher_type_id: voucherTypeId
                    })
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
    private async httpDeactivate(sessionId?: string): Promise<void> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/bill-acceptor/deactivate`,
                {
                    method: 'POST',
                    headers
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
     * HTTP implementation for QR scanner
     */
    private async httpStartQrScanner(
        signal?: AbortSignal,
        sessionId?: string
    ): Promise<string> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/qr-scanner/start`,
                {
                    method: 'POST',
                    headers,
                    signal
                }
            )

            if (response.ok) {
                const data: QrScannerSuccessResponse = await response.json()
                return data.data.content
            } else {
                const errorData: QrScannerErrorResponse = await response.json()

                // Map HTTP status codes to meaningful error messages
                switch (response.status) {
                    case 408:
                        throw new QrScannerTimeoutError(
                            'Scan timeout - no QR code detected within 20 seconds'
                        )
                    case 409:
                        throw new Error('Scan already in progress')
                    case 500:
                        throw new Error('QR scanner error')
                    case 503:
                        throw new Error('QR scanner service not available')
                    default:
                        throw new Error(
                            errorData.message || 'Unknown QR scanner error'
                        )
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            console.error('HTTP QR scanner error:', error)
            throw new Error('Failed to start QR scanner')
        }
    }

    private async httpStopQrScanner(sessionId?: string): Promise<void> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/qr-scanner/stop`,
                {
                    method: 'POST',
                    headers
                }
            )
            if (!response.ok) {
                throw new Error('Failed to stop QR scanner')
            }
        } catch (error) {
            console.error('HTTP stopQR scanner error:', error)
            throw new Error('Failed to stop QR scanner')
        }
    }

    /**
     * HTTP implementation for POS status
     */
    private async httpGetPosStatus(
        sessionId?: string
    ): Promise<PosStatusResponse> {
        try {
            const headers: Record<string, string> = {}
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(`${this.baseUrl}/api/v1/pos/status`, {
                headers
            })

            const data: PosStatusResponse = await response.json()
            return data
        } catch (error) {
            console.error('HTTP getPosStatus error:', error)
            return {
                success: false,
                message: `Failed to get POS status: ${error instanceof Error ? error.message : 'Unknown error'}`,
                errorCode: 'NETWORK_ERROR',
                device: 'pos',
                device_type: 'hardware',
                data: {},
                timestamp: new Date().toISOString()
            }
        }
    }

    /**
     * HTTP implementation for POS activate
     */
    private async httpActivatePos(
        request: PosActivateRequest,
        sessionId?: string
    ): Promise<PosActivateResponse> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (sessionId) {
                headers['X-Session-ID'] = sessionId
            }

            const response = await fetch(
                `${this.baseUrl}/api/v1/pos/activate`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(request)
                }
            )

            const data: PosActivateResponse = await response.json()
            return data
        } catch (error) {
            console.error('HTTP activatePos error:', error)
            return {
                success: false,
                message: `Failed to activate POS: ${error instanceof Error ? error.message : 'Unknown error'}`,
                errorCode: 'NETWORK_ERROR',
                device: 'pos',
                device_type: 'hardware',
                data: {},
                timestamp: new Date().toISOString()
            }
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
        window.open(
            imageUrl.replace('rotate=180', 'rotate=0'),
            '_blank',
            'popup=yes,width=400,height=1200'
        )
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

    private counter = 0

    /**
     * Local implementation for QR scanner
     * Simulates a 2-second scan delay and returns mock data
     */
    private async localStartQrScanner(signal?: AbortSignal): Promise<string> {
        console.log('start mock scan')
        this.counter++
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                if (this.counter % 300 === 0) {
                    // const mockContent =
                    //     'https://market.vcash.rs?code=123-456-789'
                    const mockContent = prompt('Enter voucher code')
                    resolve(mockContent || '')
                } else {
                    reject(new QrScannerTimeoutError('Scan timeout'))
                }
            }, 2000)

            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId)
                    reject(new Error('QR scan aborted'))
                })
            }
        })
    }

    /**
     * Local implementation for POS status
     * Returns mock status data for development
     */
    private async localGetPosStatus(): Promise<PosStatusResponse> {
        console.log('Local getPosStatus: returning mock status')
        return {
            success: true,
            message: null,
            errorCode: null,
            device: 'pos',
            device_type: 'hardware',
            data: {
                status: 'ready',
                terminalId: 'POS001',
                configuration: {
                    timeout: 30,
                    currency: 'RSD'
                }
            },
            timestamp: new Date().toISOString()
        }
    }

    /**
     * Local implementation for POS activate
     * Returns mock successful transaction data for development
     */
    private async localActivatePos(
        request: PosActivateRequest
    ): Promise<PosActivateResponse> {
        console.log('Local activatePos: mock activation', request)

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Generate mock transaction numbers
        const transactionNumber = Math.floor(
            Math.random() * 900000 + 100000
        ).toString()
        const invoiceNumber = Math.floor(
            Math.random() * 900000 + 100000
        ).toString()

        return {
            success: true,
            message: 'Activate successful',
            errorCode: null,
            device: 'pos',
            device_type: 'hardware',
            sequenceNumber: '0001',
            transactionNumber,
            deviceDraftDepositId: `draft-${Date.now()}`,
            amount: request.amount,
            terminalId: request.terminalId,
            traceId: crypto.randomUUID(),
            data: {
                TerminalID: `KLA${request.terminalId}`,
                CardIssuer: 'VISA_K',
                AID: 'A0000000031010',
                CardApplicationName: 'Visa Debit',
                CardNumber: '4532********9012',
                TransactionType: '01',
                InvoiceNumber: invoiceNumber,
                TransactionDate: new Date()
                    .toLocaleDateString('en-GB', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit'
                    })
                    .replace(/\//g, ''),
                TransactionTime: new Date()
                    .toLocaleTimeString('en-GB', { hour12: false })
                    .replace(/:/g, ''),
                RRN: Math.floor(Math.random() * 1e12)
                    .toString()
                    .padStart(12, '0'),
                ApprovalCode: Math.floor(Math.random() * 900000 + 100000)
                    .toString()
                    .padStart(6, '0'),
                ResponseCode: '00',
                TransactionStatus: 'Approved',
                Amount: (parseInt(request.amount) / 100).toFixed(2),
                EMVData: `ARQC (80) ${Math.floor(Math.random() * 1e16)
                    .toString(16)
                    .toUpperCase()}`,
                InstallmentsNumber: '',
                SignatureLine: '1'
            },
            timestamp: new Date().toISOString()
        }
    }

    // Public API methods that route to appropriate implementation

    async print(imageUrl: string, sessionId?: string): Promise<ApiResponse> {
        if (this.isHttpMode()) {
            return this.httpPrint(imageUrl, sessionId)
        }
        return this.localPrint(imageUrl)
    }

    async activate(
        jwt: string,
        voucherTypeId: string,
        sessionId?: string
    ): Promise<ActivateApiResponse> {
        if (this.isHttpMode()) {
            return this.httpActivate(
                jwt,
                voucherTypeId === 'betting' ? '30' : '20',
                sessionId
            )
        }
        return this.localActivate(jwt)
    }

    async deactivate(sessionId?: string): Promise<void> {
        if (this.isHttpMode()) {
            return this.httpDeactivate(sessionId)
        }
        return this.localDeactivate()
    }

    async saveDeviceToken(token: string, sessionId?: string): Promise<boolean> {
        if (this.isHttpMode()) {
            return this.httpSaveDeviceToken(token, sessionId)
        }
        return this.localSaveDeviceToken(token)
    }

    async getDeviceToken(sessionId?: string): Promise<string> {
        if (this.isHttpMode()) {
            return this.httpGetDeviceToken(sessionId)
        }
        return this.localGetDeviceToken()
    }

    async sendLog(
        level: string,
        message: string,
        sessionId?: string
    ): Promise<void> {
        if (this.isHttpMode()) {
            return this.httpSendLog(level, message, sessionId)
        }
        return this.localSendLog(level, message)
    }

    async getCredentials(
        sessionId?: string
    ): Promise<DeviceCredentials | null> {
        if (this.isHttpMode()) {
            return this.httpGetCredentials(sessionId)
        }
        return this.localGetCredentials()
    }

    async startQrScanner(
        signal?: AbortSignal,
        sessionId?: string
    ): Promise<string | undefined> {
        while (signal?.aborted === false) {
            try {
                if (this.isHttpMode()) {
                    return await this.httpStartQrScanner(signal, sessionId)
                } else {
                    return await this.localStartQrScanner(signal)
                }
            } catch (error) {
                // If it's a timeout error, retry the scan
                if (error instanceof QrScannerTimeoutError) {
                    console.log('QR scan timeout, retrying...')
                    continue
                }
                // For all other errors, throw immediately
                throw error
            }
        }
    }

    async stopQrScanner(sessionId?: string): Promise<void> {
        if (this.isHttpMode()) {
            return this.httpStopQrScanner(sessionId)
        }
        console.log('stop mock scan')
        return Promise.resolve()
    }

    async getPosStatus(sessionId?: string): Promise<PosStatusResponse> {
        if (this.isHttpMode()) {
            return this.httpGetPosStatus(sessionId)
        }
        return this.localGetPosStatus()
    }

    async activatePos(
        request: PosActivateRequest,
        sessionId?: string
    ): Promise<PosActivateResponse> {
        if (this.isHttpMode()) {
            return this.httpActivatePos(request, sessionId)
        }
        return this.localActivatePos(request)
    }
}

// Create singleton instance
export const apiService = new ApiService()

// Development helper - expose to window for debugging
if (import.meta.env.DEV) {
    ;(window as unknown as { apiService: ApiService }).apiService = apiService
}

// Export types for external use
export type {
    ActivateApiResponse,
    ApiMode,
    ApiResponse,
    DeviceCredentials,
    PosActivateRequest,
    PosActivateResponse,
    PosStatusResponse
}
export { QrScannerTimeoutError }
