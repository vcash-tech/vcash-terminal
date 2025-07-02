export {}

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

declare global {
    interface Window {
        api: {
            print: (voucherCode: string) => Promise<ApiResponse>
            activate: (jwt: string) => Promise<ActivateApiResponse>
            deactivate: () => Promise<void>
            saveDeviceToken: (token: string) => Promise<boolean>
            getDeviceToken: () => Promise<string>
            sendLog: (level: string, message: string) => Promise<void>
        }
    }
}
