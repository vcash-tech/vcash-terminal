import { Auth } from '../types/common/httpRequest'

export class AuthService {
    static GetToken(auth: Auth): string | null {
        const token = localStorage.getItem(`${auth}_token`)
        if (!token) {
            return null
        }
        return `Bearer ${token}`
    }

    static SetToken(auth: Auth, token: string): void {
        localStorage.setItem(`${auth}_token`, token)
    }

    static DeleteToken(auth: Auth): void {
        localStorage.removeItem(`${auth}_token`)
    }

    static HasToken(auth: Auth): boolean {
        return !!AuthService.GetToken(auth)
    }
}
