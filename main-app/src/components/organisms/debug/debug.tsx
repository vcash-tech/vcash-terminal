import { useState } from 'react'

import { apiService } from '@/services/apiService'
import { AuthService } from '@/services/authService'
import { Auth } from '@/types/common/httpRequest'

const Debug = () => {
    // Runtime debug mode state
    const [runtimeDebugMode, setRuntimeDebugMode] = useState(() => {
        return localStorage.getItem('runtime_debug_mode') === 'true'
    })

    // Hidden debug activation state
    const [clickCount, setClickCount] = useState(0)
    const [firstClickTime, setFirstClickTime] = useState<number | null>(null)

    // Check if debug mode is active (either build-time or runtime)
    const isDebugActive = __DEBUG_MODE__ || runtimeDebugMode

    const handleSecretAreaClick = () => {
        const now = Date.now()

        // Reset if more than 5 seconds have passed since first click
        if (firstClickTime && now - firstClickTime > 5000) {
            setClickCount(1)
            setFirstClickTime(now)
            return
        }

        // First click
        if (clickCount === 0) {
            setClickCount(1)
            setFirstClickTime(now)
        } else {
            const newCount = clickCount + 1
            setClickCount(newCount)

            // Check if we've reached 10 clicks
            if (newCount >= 10) {
                // Reset click tracking
                setClickCount(0)
                setFirstClickTime(null)

                // Prompt for PIN
                const pin = prompt('Enter debug PIN:')
                if (pin === '2213') {
                    setRuntimeDebugMode(true)
                    localStorage.setItem('runtime_debug_mode', 'true')
                    alert('Debug mode activated!')
                } else if (pin !== null) {
                    alert('Invalid PIN')
                }
            }
        }
    }

    const handleDisableDebugMode = () => {
        setRuntimeDebugMode(false)
        localStorage.removeItem('runtime_debug_mode')
        alert('Debug mode disabled')
    }

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
        <>
            {/* Hidden debug activation area */}
            <div
                onClick={handleSecretAreaClick}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '120px',
                    height: '80px',
                    cursor: 'default',
                    zIndex: 1000
                    // Uncomment next line for debugging the click area
                    // backgroundColor: 'rgba(255, 0, 0, 0.1)'
                }}
                title="" // No tooltip to keep it hidden
            />

            {/* Debug buttons */}
            {isDebugActive && (
                <>
                    <span>build: {__BUILD_TIMESTAMP__}</span>
                    {runtimeDebugMode && (
                        <button
                            onClick={handleDisableDebugMode}
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                background: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                            Disable Debug
                        </button>
                    )}
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
        </>
    )
}

export default Debug
