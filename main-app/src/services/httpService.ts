import {
    Auth,
    HttpError,
    HttpRequest,
    HttpRequestMethod,
    RequestService
} from '../types/common/httpRequest'
import { AuthService } from './authService'

type requestServiceKeys = Record<keyof typeof RequestService, string>

const serviceApiUrls: requestServiceKeys = {
    VCash: import.meta.env.VITE_API_URL ?? ''
}

export class HttpService {
    static async Request<T>(req: HttpRequest): Promise<T> {
        // Determine if we're in development mode
        const isDev = import.meta.env.DEV === true

        // In development mode, we use the proxy for all API endpoints
        const serviceUrl = isDev ? '' : serviceApiUrls[req.service]
        const requestUrl = `${serviceUrl}${req.url}`

        const request: globalThis.RequestInit = {}

        request.method = req.method

        if (
            req.body &&
            req.contentType !== 'application/x-www-form-urlencoded'
        ) {
            request.body = JSON.stringify(req.body)
        } else if (
            req.body &&
            req.contentType === 'application/x-www-form-urlencoded'
        ) {
            request.body = req.body as unknown as URLSearchParams
        }

        const headers: { [key: string]: string } = {}

        headers['Content-Language'] = 'sr-SP'
        headers['Content-Type'] = req.contentType ?? 'application/json'

        let hasToken = false
        if (req.authorization) {
            let token = await AuthService.GetToken(req.authorization)
            if (!token) {
                // this is a terrible hack to avoid re-architecting the entire thing to asyncrhonously get the token
                // the AD auth context does not have a token until the supabase client is initialized, but http service gets invoked before that
                // so we wait a bit and try again.
                // ideal solution would be to make get token async and await auth context initialization
                await new Promise((resolve) => {
                    setTimeout(resolve, 500)
                })
                token = await AuthService.GetToken(req.authorization)
            }
            if (token) {
                hasToken = true
                headers['Authorization'] = token
            }
        }

        request.headers = headers

        try {
            const response = await fetch(requestUrl, request)

            if (!response.ok) {
                if (response.status === 401 && hasToken) {
                    AuthService.DeleteToken(req.authorization as Auth)
                    if ((req.authorization as Auth) === Auth.Agent) {
                        location.reload()
                    }
                }

                const textError = await response.text()
                let jsonError = undefined

                try {
                    jsonError = JSON.parse(textError)
                } catch (error: unknown) {
                    console.log(
                        'error parsing json from bad api response',
                        error
                    )
                }

                throw {
                    status: response.status,
                    statusText: response.statusText,
                    errors: jsonError?.errors,
                    text: textError
                } as HttpError
            }

            // Only try to parse as JSON if the content-type indicates JSON
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json()
                return result as T
            } else {
                // For non-JSON responses, return an empty object or handle as needed
                return {} as T
            }
        } catch (error) {
            console.error('API request failed:', error)
            throw error
        }
    }

    static async Get<T>(
        url: string,
        authorization?: Auth,
        service = RequestService.VCash
    ): Promise<T> {
        return HttpService.Request<T>({
            service,
            url,
            authorization,
            method: HttpRequestMethod.Get
        })
    }

    static async Post<T>(
        url: string,
        body: unknown,
        authorization?: Auth,
        service = RequestService.VCash
    ): Promise<T> {
        return HttpService.Request<T>({
            service,
            url,
            body,
            authorization,
            method: HttpRequestMethod.Post
        })
    }

    static async Put<T>(
        url: string,
        body: unknown,
        authorization?: Auth,
        service = RequestService.VCash
    ): Promise<T> {
        return HttpService.Request<T>({
            service,
            url,
            body,
            authorization,
            method: HttpRequestMethod.Put
        })
    }

    static async Patch<T>(
        url: string,
        body: unknown,
        authorization?: Auth,
        service = RequestService.VCash
    ): Promise<T> {
        return HttpService.Request<T>({
            service,
            url,
            body,
            authorization,
            method: HttpRequestMethod.Patch
        })
    }

    static async Delete<T>(
        url: string,
        authorization?: Auth,
        body?: unknown,
        service = RequestService.VCash
    ): Promise<T> {
        return HttpService.Request<T>({
            service,
            url,
            body,
            authorization,
            method: HttpRequestMethod.Delete
        })
    }
}
