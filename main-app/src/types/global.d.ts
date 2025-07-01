export {}

interface ApiResponse {
    success: boolean
    message: string
    status: {
        iLogicCode: number
        iPhyCode: number
    }
}

declare global {
    interface Window {
        api: {
            print: (voucherCode: string) => Promise<string>
            activate: (jwt: string) => Promise<ApiResponse>
            deactivate: () => Promise<ApiResponse>
            saveDeviceToken: (token: string) => Promise<boolean>
            getDeviceToken: () => Promise<string>
            sendLog: (level: string, message: string) => Promise<void>
        }
    }
}
