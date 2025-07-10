import { useEffect, useRef, useState } from 'react'
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

    useEffect(() => {
        if (AuthService.HasToken(Auth.POS)) {
            navigate('/register')
        }
    }, [navigate])

    // Check for auto-credentials and start registration automatically
    useEffect(() => {
        const checkCredentials = async () => {
            try {
                const credentials = await apiService.getCredentials()
                if (credentials) {
                    console.log('Auto-credentials found:', credentials)
                    // Set the form fields
                    setAgentEmail(credentials.email)
                    setDeviceName(credentials.device_name)

                    // Auto-start the registration process
                    setLoader(true)
                    try {
                        const deviceCodeResponse =
                            await POSService.generateDeviceCodeEmail({
                                agentEmail: credentials.email,
                                deviceName: credentials.device_name,
                                deviceTypeId: 20
                            })
                        setStepper(DeviceTokenSteps.gettingToken)
                        getDeviceToken(
                            deviceCodeResponse.agentId,
                            deviceCodeResponse.deviceCode
                        )
                    } catch (error) {
                        const { code, description } = getErrorInfo(error)
                        console.log(
                            'Auto-registration failed:',
                            code,
                            description
                        )
                        setStepper(DeviceTokenSteps.getCode)
                    } finally {
                        setLoader(false)
                    }
                }
            } catch (error) {
                console.error('Error checking credentials:', error)
            }
        }

        // Only check credentials if we don't already have a device token
        if (!AuthService.HasToken(Auth.POS)) {
            checkCredentials()
        }
    }, [navigate])

    async function getDeviceToken(agentId: string, deviceCode: string) {
        try {
            const deviceTokenResponse = await POSService.generateDeviceToken({
                agentId: agentId,
                deviceCode: deviceCode
            })

            setStepper(DeviceTokenSteps.gotToken)
            await deviceTokenService.saveDeviceToken(deviceTokenResponse.token)

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
    }

    const handleRegisterDevice = async () => {
        setLoader(true)
        try {
            const deviceCodeResponse = await POSService.generateDeviceCodeEmail(
                {
                    agentEmail,
                    deviceName,
                    deviceTypeId: 20
                }
            )
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
    }

    return (
        <RegisterTemplate
            onRegister={handleRegisterDevice}
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
