import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import RegisterTemplate from '@/components/templates/register/registerTemplate'
import { DeviceTokenSteps } from '@/data/enums/deviceTokenSteps'
import { getErrorInfo } from '@/helpers/getErrorInfo'
import { apiService } from '@/services/apiService'
import { AuthService } from '@/services/authService'
import { deviceTokenService } from '@/services/deviceTokenService'
import { POSService } from '@/services/posService'
import { Auth } from '@/types/common/httpRequest'

function RegisterPage() {
    const [agentEmail, setAgentEmail] = useState('')
    const [deviceName, setDeviceName] = useState('')
    const [stepper, setStepper] = useState<DeviceTokenSteps>(
        DeviceTokenSteps.getCode
    )
    const stepperRef = useRef<DeviceTokenSteps>(stepper)

    const [_loader, setLoader] = useState<boolean>(false)

    const navigate = useNavigate()

    stepperRef.current = stepper

    const getDeviceToken = useCallback(
        async (agentId: string, deviceCode: string) => {
            try {
                const deviceTokenResponse =
                    await POSService.generateDeviceToken({
                        agentId: agentId,
                        deviceCode: deviceCode
                    })

                setStepper(DeviceTokenSteps.gotToken)
                await deviceTokenService.saveDeviceToken(
                    deviceTokenResponse.token
                )

                // Create session immediately after device registration
                await POSService.createSession()
            } catch (err: unknown) {
                const { code, description: _description } = getErrorInfo(err) // TODO: remove _ in _description once we start using it

                if (
                    code === 'DEVICE_NOT_AUTHORIZED' &&
                    stepperRef.current === DeviceTokenSteps.gettingToken
                ) {
                    setTimeout(() => getDeviceToken(agentId, deviceCode), 10000)
                    return
                }
                if (stepperRef.current !== DeviceTokenSteps.getCode) {
                    // enqueueSnackbar(
                    //     "Greška pri kreiranju tokena za uređaj. Molim Vas unesite podatke i pokušajte ponovo.",
                    //     { variant: "error" },
                    // );
                }
                setStepper(DeviceTokenSteps.getCode)
            } finally {
                setLoader(false)
            }
        },
        [setStepper, setLoader, stepperRef]
    )

    const handleRegisterDevice = useCallback(
        async (email: string, name: string) => {
            setLoader(true)
            try {
                const deviceCodeResponse =
                    await POSService.generateDeviceCodeEmail({
                        agentEmail: email,
                        deviceName: name,
                        deviceTypeId: 20
                    })
                setStepper(DeviceTokenSteps.gettingToken)
                getDeviceToken(
                    deviceCodeResponse.agentId,
                    deviceCodeResponse.deviceCode
                )
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                const { code, description } = getErrorInfo(error)

                console.log(code, description)
                // enqueueSnackbar(
                //     `Greška pri kreiranju koda za uređaj. ${description} `,
                //     { variant: "error" },
                // );
            } finally {
                setLoader(false)
            }
        },
        [setLoader, setStepper, getDeviceToken]
    )

    useEffect(() => {
        const checkTokenAndCredentials = async () => {
            // First, check if we have a valid token and can create a session
            if (AuthService.HasToken(Auth.POS)) {
                try {
                    console.log(
                        'Device token found on register page - attempting to create session...'
                    )
                    await POSService.createSession()
                    console.log(
                        '✅ Session created successfully - redirecting to welcome from register page'
                    )
                    navigate('/welcome')
                    return // Exit early if successful
                } catch (error) {
                    console.error(
                        'Failed to create session, clearing invalid token:',
                        error
                    )

                    // Clear any invalid tokens
                    AuthService.DeleteToken(Auth.POS)
                    AuthService.DeleteToken(Auth.Cashier)

                    // Clear from persistent storage
                    try {
                        await apiService.saveDeviceToken('')
                    } catch (clearError) {
                        console.error(
                            'Failed to clear device token from persistent storage:',
                            clearError
                        )
                    }
                }
            }

            // If no token or session creation failed, try to get auto-credentials
            try {
                const credentials = await apiService.getCredentials()
                if (credentials) {
                    console.log('Auto-credentials found:', credentials)
                    // Set the form fields
                    setAgentEmail(credentials.email)
                    setDeviceName(credentials.device_name)

                    // Call handleRegisterDevice directly with credentials
                    handleRegisterDevice(
                        credentials.email,
                        credentials.device_name
                    )
                } else {
                    // No auto-credentials available, let user manually register
                    console.log(
                        'No auto-credentials available - showing manual registration form'
                    )
                    setStepper(DeviceTokenSteps.getCode)
                    setAgentEmail('')
                    setDeviceName('')
                }
            } catch (error) {
                console.error('Error checking credentials:', error)
                // Fallback to manual registration
                setStepper(DeviceTokenSteps.getCode)
                setAgentEmail('')
                setDeviceName('')
            }
        }

        checkTokenAndCredentials()
    }, [navigate, handleRegisterDevice])

    const onRegister = useCallback(() => {
        handleRegisterDevice(agentEmail, deviceName)
    }, [agentEmail, deviceName, handleRegisterDevice])

    return (
        <RegisterTemplate
            onRegister={onRegister}
            navigate={navigate}
            agentEmail={agentEmail}
            onChangeAgentEmail={(email: string) => {
                setAgentEmail(email)
            }}
            stepper={stepper}
            deviceName={deviceName}
            onChangeDeviceName={setDeviceName}
        />
    )
}

export default RegisterPage
