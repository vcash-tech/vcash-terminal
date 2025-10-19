import { useState } from 'react'

import { AuthService } from '@/services/authService'
import { Auth } from '@/types/common/httpRequest'
import { apiService } from '@/services/apiService'

const Debug = () => {
    // Runtime debug mode state
    const [runtimeDebugMode, setRuntimeDebugMode] = useState(() => {
        return localStorage.getItem('runtime_debug_mode') === 'true'
    })

    // Hidden debug activation state
    const [clickCount, setClickCount] = useState(0)
    const [firstClickTime, setFirstClickTime] = useState<number | null>(null)

    // PIN entry state
    const [showPinEntry, setShowPinEntry] = useState(false)
    const [enteredDigits, setEnteredDigits] = useState<number[]>([])
    const [pinTimeout, setPinTimeout] = useState<number | null>(null)

    // Speed test dialog state
    const [isSpeedTestOpen, setIsSpeedTestOpen] = useState(false)

    // Check if debug mode is active (either build-time or runtime)
    const isDebugActive =
        import.meta.env.VITE_DEBUG_MODE === 'true' || runtimeDebugMode

    const clearPinTimeout = () => {
        if (pinTimeout) {
            clearTimeout(pinTimeout)
            setPinTimeout(null)
        }
    }

    const resetPinEntry = () => {
        setShowPinEntry(false)
        setEnteredDigits([])
        clearPinTimeout()
    }

    const startPinTimeout = () => {
        clearPinTimeout()
        const timeout = setTimeout(() => {
            resetPinEntry()
        }, 10000) // 10 seconds
        setPinTimeout(timeout as unknown as number)
    }

    const handleDigitClick = (digit: number) => {
        clearPinTimeout()
        const newDigits = [...enteredDigits, digit]
        setEnteredDigits(newDigits)

        // Check if we have the last 4 digits as 2213
        if (newDigits.length >= 4) {
            const lastFour = newDigits.slice(-4)
            if (lastFour.join('') === '2213') {
                // Activate debug mode
                setRuntimeDebugMode(true)
                localStorage.setItem('runtime_debug_mode', 'true')
                resetPinEntry()
                alert('Debug mode activated!')
                return
            }
        }

        // Restart timeout
        startPinTimeout()
    }

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

                // Show PIN entry interface
                setShowPinEntry(true)
                setEnteredDigits([])
                startPinTimeout()
            }
        }
    }

    const handleDisableDebugMode = () => {
        setRuntimeDebugMode(false)
        localStorage.removeItem('runtime_debug_mode')
        alert('Debug mode disabled')
    }

    const handleMoneyTransferVoucherDraft = async () => {
        alert('About to call money transfer voucher draft API...')

        const baseUrl = import.meta.env.VITE_API_URL
        if (!baseUrl) {
            alert('VITE_API_URL is not configured')
            return
        }

        const token = AuthService.GetToken(Auth.Cashier)
        if (!token) {
            alert('No cashier token available. Please authenticate first.')
            return
        }

        try {
            const response = await fetch(
                `${baseUrl}/cashier-app/money-transfer/voucher/draft`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    body: JSON.stringify({ amount: 500 })
                }
            )

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                )
            }

            alert(
                `Money Transfer Draft Success: ${JSON.stringify(responseData, null, 2)}`
            )
        } catch (error) {
            alert(
                `Money Transfer Draft Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    const handlePrintDebug = async () => {
        alert('About to call apiService.print() with template URL...')

        const voucherData = {
            url: 'https://vcash.rs/urlmorabitimaloduzidabipreci/dstaviokakoceizgledati/kadasezapravokoristizanestokorisnostousebiukljucujekodvaucereaidrugekorisnestvari',
            voucherCode: '123-456-789',
            publicCode: 'APT-APT',
            venueName: 'Test Uplatno Mesto  ',
            venueAddress: 'Булевар Вудроа Вилсона 14',
            venueCity: 'Београд',
            amount: '1.000',
            currencyCode: 'RSD',
            createdAt: '04.10.2023. 23:28',
            currentTime: '04.10.2022. 23:28',
            voucherType: 'Bet Vaučer'
        }

        const jsonString = JSON.stringify(voucherData)
        const utf8Bytes = new TextEncoder().encode(jsonString)

        // Convert Uint8Array to base64
        const base64Data = btoa(
            Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('')
        )

        const templateUrl = `https://bp-templates.fly.dev/render/terminal_voucher?data=${encodeURIComponent(base64Data)}&type=bmp&rotate=180`

        try {
            const response = await apiService.print(templateUrl)
            alert(`Print response: ${JSON.stringify(response, null, 2)}`)
        } catch (error) {
            alert(
                `Print error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    // const handleGetCredentialsDebug = async () => {
    //     alert('About to call apiService.getCredentials()...')

    //     try {
    //         const response = await apiService.getCredentials()
    //         alert(`Credentials response: ${JSON.stringify(response, null, 2)}`)
    //     } catch (error) {
    //         alert(
    //             `Credentials error: ${error instanceof Error ? error.message : 'Unknown error'}`
    //         )
    //     }
    // }

    // const handleResetDeviceRegistration = async () => {
    //     const confirmed = confirm(
    //         'Are you sure you want to reset device registration? This will clear all tokens and require re-registration.'
    //     )

    //     if (!confirmed) return

    //     alert('Resetting device registration...')

    //     try {
    //         // Try clearing with "token-reset" to ensure it overwrites
    //         const resetTokenResponse =
    //             await apiService.saveDeviceToken('token-reset')

    //         // Show the API response
    //         alert(
    //             `Reset Token API Response: ${JSON.stringify(resetTokenResponse, null, 2)}`
    //         )

    //         // Also try with empty string
    //         const emptyTokenResponse = await apiService.saveDeviceToken('')

    //         // Show the empty token API response
    //         alert(
    //             `Empty Token API Response: ${JSON.stringify(emptyTokenResponse, null, 2)}`
    //         )

    //         // Clear localStorage tokens
    //         AuthService.DeleteToken(Auth.POS)
    //         AuthService.DeleteToken(Auth.Cashier)

    //         // Verify the token was actually cleared by checking what's stored
    //         const verifyToken = await apiService.getDeviceToken()

    //         alert(
    //             `Device registration reset completed!\nStored token after reset: "${verifyToken}"\nPlease refresh the page.`
    //         )
    //     } catch (error) {
    //         alert(
    //             `Reset error: ${error instanceof Error ? error.message : 'Unknown error'}`
    //         )
    //     }
    // }

    const handleRefreshPage = () => {
        window.location.reload()
    }

    const handleNavigateToAltUrl = () => {
        const altUrl = import.meta.env.VITE_ALT_URL

        if (!altUrl || typeof altUrl !== 'string' || altUrl.trim() === '') {
            alert('VITE_ALT_URL is not set or is empty')
            return
        }

        if (!altUrl.startsWith('http://') && !altUrl.startsWith('https://')) {
            alert('VITE_ALT_URL must begin with http:// or https://')
            return
        }

        const confirmed = confirm(`Navigate to: ${altUrl}?`)
        if (confirmed) {
            window.location.href = altUrl
        }
    }

    const handleOpenSpeedTest = () => {
        setIsSpeedTestOpen(true)
    }

    const handleCloseSpeedTest = () => {
        setIsSpeedTestOpen(false)
    }

    return (
        <>
            {/* Hidden debug activation area - only render when debug is not active */}
            {!isDebugActive && (
                <div
                    onClick={handleSecretAreaClick}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: '350px', // Position just before language buttons
                        width: '320px',
                        height: '80px',
                        cursor: 'default',
                        zIndex: 1000
                        // Uncomment next line for debugging the click area
                        // backgroundColor: 'rgba(255, 0, 0, 0.1)'
                    }}
                    title="" // No tooltip to keep it hidden
                />
            )}

            {/* PIN Entry Interface */}
            {showPinEntry && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100px',
                        right: '50px',
                        background: 'rgba(0, 0, 0, 0.9)',
                        padding: '20px',
                        borderRadius: '8px',
                        zIndex: 2000
                    }}>
                    <div
                        style={{
                            color: 'white',
                            marginBottom: '15px',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}>
                        Enter PIN (last 4 digits:{' '}
                        {enteredDigits.slice(-4).join('')})
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '8px',
                            maxWidth: '250px'
                        }}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                            <button
                                key={digit}
                                onClick={() => handleDigitClick(digit)}
                                style={{
                                    padding: '12px',
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    minWidth: '40px'
                                }}>
                                {digit}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={resetPinEntry}
                        style={{
                            marginTop: '15px',
                            padding: '8px 12px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            width: '100%'
                        }}>
                        Cancel
                    </button>
                </div>
            )}

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
                    {/* <button
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
                    </button> */}
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
                        onClick={handleNavigateToAltUrl}
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
                        Change env
                    </button>
                    <button
                        onClick={handleOpenSpeedTest}
                        style={{
                            marginLeft: '5px',
                            padding: '5px 10px',
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}>
                        Speed Test
                    </button>
                    {import.meta.env.VITE_DEBUG_MODE === 'true' && (
                        <button
                            onClick={handleMoneyTransferVoucherDraft}
                            style={{
                                marginLeft: '5px',
                                padding: '5px 10px',
                                background: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                            Money Transfer
                        </button>
                    )}
                </>
            )}

            {/* Speed Test Dialog */}
            {isSpeedTestOpen && (
                <dialog
                    open
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '800px',
                        height: '80%',
                        maxHeight: '600px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '20px',
                        backgroundColor: 'white',
                        zIndex: 10000
                    }}
                    onClick={(e) => {
                        // Close if clicking on backdrop
                        if (e.target === e.currentTarget) {
                            handleCloseSpeedTest()
                        }
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                        <h3 style={{ margin: 0 }}>Internet Speed Test</h3>
                        <button
                            onClick={handleCloseSpeedTest}
                            style={{
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}>
                            Close
                        </button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ minHeight: '360px' }}>
                            <div
                                style={{
                                    width: '100%',
                                    height: 0,
                                    paddingBottom: '50%',
                                    position: 'relative'
                                }}>
                                <iframe
                                    style={{
                                        border: 'none',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        minHeight: '360px',
                                        overflow: 'hidden !important'
                                    }}
                                    src="https://www.metercustom.net/plugin/"
                                />
                            </div>
                        </div>
                        Provided by{' '}
                        <a
                            href="https://www.meter.net"
                            target="_blank"
                            rel="noopener noreferrer">
                            Meter.net
                        </a>
                    </div>
                </dialog>
            )}
        </>
    )
}

export default Debug
