import LanguageButton from '@/components/atoms/languageButton/languageButton'
import LinkBackButton from '@/components/atoms/linkBackButton/linkBackButton'
import { useTranslate } from '@/i18n/useTranslate'
import { apiService } from '@/services/apiService'
import { AuthService } from '@/services/authService'
import { Auth } from '@/types/common/httpRequest'

import { flagEN, flagRS } from '../../../assets/icons'

type HeaderProps = {
    navigationBackText?: string
    navigateBackUrl?: string
    isWelcome?: boolean
}

const Header = ({
    navigationBackText,
    navigateBackUrl,
    isWelcome
}: HeaderProps) => {
    const { t, changeLanguage, isLanguageActive } = useTranslate()

    const handlePrintDebug = async () => {
        alert('About to call apiService.print() with template URL...')

        const templateUrl =
            'https://bp-templates.fly.dev/render/terminal_voucher?data=ewogICAgInVybCI6ICJodHRwczovL3ZjYXNoLnJzL3VybG1vcmFiaXRpbWFsb2R1emlkYWJpcHJlY2kvZHN0YXZpb2tha29jZWl6Z2xlZGF0aS9rYWRhc2V6YXByYXZva29yaXN0aXphbmVzdG9rb3Jpc25vc3RvdXNlYml1a2xqdWN1amVrb2R2YXVjZXJlYWlkcnVnZWtvcmlzbmVzdHZhcmkiLAogICAgInZvdWNoZXJDb2RlIjogIjEyMy00NTYtNzg5IiwKICAgICJwdWJsaWNDb2RlIjogIkFQVC1BUFQiLAogICAgInZlbnVlTmFtZSI6ICJUZXN0IFVwbGF0bm8gTWVzdG8iLAogICAgInZlbnVlQWRkcmVzcyI6ICJUZXN0IEFkcmVzYSIsCiAgICAidmVudWVDaXR5IjogIlRlc3QgZ3JhZCIsCiAgICAiYW1vdW50IjogIjEuMDAwIiwKICAgICJjdXJyZW5jeUNvZGUiOiAiUlNEIiwKICAgICJjcmVhdGVkQXQiOiAiMDQuMTAuMjAyMy4gMjM6MjgiLAogICAgImN1cnJlbnRUaW1lIjogIjA0LjEwLjIwMjIuIDIzOjI4Igp9&type=bmp&rotate=180'

        try {
            const response = await apiService.print(templateUrl)
            alert(`Print response: ${JSON.stringify(response, null, 2)}`)
        } catch (error) {
            alert(
                `Print error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    const handleGetCredentialsDebug = async () => {
        alert('About to call apiService.getCredentials()...')

        try {
            const response = await apiService.getCredentials()
            alert(`Credentials response: ${JSON.stringify(response, null, 2)}`)
        } catch (error) {
            alert(
                `Credentials error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    const handleResetDeviceRegistration = async () => {
        const confirmed = confirm(
            'Are you sure you want to reset device registration? This will clear all tokens and require re-registration.'
        )

        if (!confirmed) return

        alert('Resetting device registration...')

        try {
            // Try clearing with "token-reset" to ensure it overwrites
            const resetTokenResponse =
                await apiService.saveDeviceToken('token-reset')

            // Show the API response
            alert(
                `Reset Token API Response: ${JSON.stringify(resetTokenResponse, null, 2)}`
            )

            // Also try with empty string
            const emptyTokenResponse = await apiService.saveDeviceToken('')

            // Show the empty token API response
            alert(
                `Empty Token API Response: ${JSON.stringify(emptyTokenResponse, null, 2)}`
            )

            // Clear localStorage tokens
            AuthService.DeleteToken(Auth.POS)
            AuthService.DeleteToken(Auth.Cashier)

            // Verify the token was actually cleared by checking what's stored
            const verifyToken = await apiService.getDeviceToken()

            alert(
                `Device registration reset completed!\nStored token after reset: "${verifyToken}"\nPlease refresh the page.`
            )
        } catch (error) {
            alert(
                `Reset error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    const handleRefreshPage = () => {
        window.location.reload()
    }

    const handleGetDeviceTokenDebug = async () => {
        alert('About to call apiService.getDeviceToken()...')

        try {
            const deviceToken = await apiService.getDeviceToken()
            const localStorageToken = localStorage.getItem(`${Auth.POS}_token`)

            const result = {
                deviceToken: deviceToken || '(empty)',
                localStorageToken: localStorageToken || '(empty)',
                hasDeviceToken: !!deviceToken,
                hasLocalStorageToken: !!localStorageToken,
                tokensMatch: deviceToken === localStorageToken
            }

            alert(`Device Token Info:\n${JSON.stringify(result, null, 2)}`)
        } catch (error) {
            alert(
                `Get Device Token error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    return (
        <header className={`header ${isWelcome ? 'welcome-no-border' : ''}`}>
            <div className="header-left">
                {navigationBackText && navigateBackUrl && (
                    <LinkBackButton
                        buttonText={navigationBackText || t('header.back')}
                        buttonUrl={navigateBackUrl}
                    />
                )}
                {/* Debug buttons */}
                {__DEBUG_MODE__ && (
                    <>
                        <span>build: {__BUILD_TIMESTAMP__}</span>
                        <button
                            onClick={handlePrintDebug}
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                background: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                            Debug Print
                        </button>
                        <button
                            onClick={handleGetCredentialsDebug}
                            style={{
                                marginLeft: '5px',
                                padding: '5px 10px',
                                background: '#4ecdc4',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                            Debug Credentials
                        </button>
                        <button
                            onClick={handleResetDeviceRegistration}
                            style={{
                                marginLeft: '5px',
                                padding: '5px 10px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                            Reset Device
                        </button>
                        <button
                            onClick={handleRefreshPage}
                            style={{
                                marginLeft: '5px',
                                padding: '5px 10px',
                                background: '#9b59b6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                            Refresh
                        </button>
                        <button
                            onClick={handleGetDeviceTokenDebug}
                            style={{
                                marginLeft: '5px',
                                padding: '5px 10px',
                                background: '#f39c12',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                            Get Token
                        </button>
                    </>
                )}
            </div>
            <div className="header-right">
                <LanguageButton
                    flag={flagRS}
                    language="RS"
                    callback={() => changeLanguage('rs')}
                    active={isLanguageActive('rs')}
                />
                <LanguageButton
                    flag={flagEN}
                    language="EN"
                    callback={() => changeLanguage('en')}
                    active={isLanguageActive('en')}
                />
            </div>
        </header>
    )
}

export default Header
