import { LinearProgress } from '@mui/material'
import { useRef, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { deviceIcon, userIcon } from '@/assets/icons'
import Container from '@/components/atoms/container/container'
import Input from '@/components/atoms/input/input'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { DeviceTokenSteps } from '@/data/enums/deviceTokenSteps'

const BRAND_NAME = import.meta.env.VITE_BRAND_NAME

export type RegisterTemplateProps = {
    agentName?: string
    agentEmail?: string
    deviceName?: string
    agentSurname?: string
    agentPhoneNumber?: string
    agentPassword?: string
    agentPasswordRepeat?: string
    navigate: NavigateFunction
    onRegister: () => void
    stepper: DeviceTokenSteps
    onChangeDeviceName: (name: string) => void
    onChangeAgentEmail: (email: string) => void
}
export default function RegisterTemplate({
    navigate,
    onChangeDeviceName,
    onRegister,
    onChangeAgentEmail,
    stepper,
    agentEmail: email,
    deviceName: device
}: RegisterTemplateProps) {
    const stepperRef = useRef<DeviceTokenSteps>(stepper)
    const [agentEmail, setAgentEmail] = useState(email)
    const [deviceName, setDeviceName] = useState(device)

    return (
        <Container isFullHeight={true}>
            <div className={'register-container'}>
                <div className="card">
                    <div className="flex flex-col h-full last:pb-[8rem]">
                        <div className="flex justify-center desktop:justify-start w-full pt-12 pb-6">
                            <h1>Registracija uređaja</h1>
                        </div>

                        {/* Form and Button container */}
                        {stepperRef.current === DeviceTokenSteps.getCode && (
                            <div
                                className={`flex flex-col h-full gap-y-12 justify-center px-8`}>
                                {/* Form */}
                                <div className="flex flex-col justify-center gap-y-4 w-full">
                                    <div
                                        className={`flex items-center relative`}>
                                        <Input
                                            id={'agentId'}
                                            type={'email'}
                                            value={agentEmail}
                                            onChange={(_id, value) => {
                                                setAgentEmail(value)
                                                onChangeAgentEmail(value)
                                            }}
                                            icon={userIcon}
                                            autoCorrect={false}
                                            placeholder="Email"
                                        />
                                    </div>

                                    <div
                                        className={`flex items-center relative`}>
                                        <Input
                                            id={'deviceName'}
                                            value={deviceName}
                                            onChange={(_id, value) => {
                                                setDeviceName(value)
                                                onChangeDeviceName(value)
                                            }}
                                            icon={deviceIcon}
                                            autoCorrect={false}
                                            placeholder="Ime uređaja"
                                        />
                                    </div>
                                </div>

                                <PrimaryButton
                                    text={'Register Device'}
                                    callback={onRegister}
                                />
                            </div>
                        )}

                        {stepperRef.current ===
                            DeviceTokenSteps.gettingToken && (
                            <div
                                className={`flex flex-col h-full gap-y-12 justify-center realtive`}>
                                <div className="flex flex-col justify-center px-8">
                                    <div className="text-4xl text-primary w-full text-center">
                                        Čeka se odobrenje
                                    </div>

                                    <div className="w-full text-center text-secondary-text text-xl mt-12">
                                        Odobrenje uređaja je trenutno na
                                        čekanju, dok se ne odobri od strane
                                        Agenta iz {BRAND_NAME} mreže.
                                    </div>

                                    {/* <div className="flex justify-center mt-16">
                          <span
                              className="text-link text-2xl cursor-pointer p-4"
                              onClick={() =>
                                  setStepper(DeviceTokenSteps.getCode)
                              }
                          >
                              Pokušaj ponovo
                          </span>
                      </div> */}
                                </div>

                                <div className="h-auto w-full absolute bottom-0">
                                    <LinearProgress
                                        className="h-3"
                                        color="primary"></LinearProgress>
                                </div>
                            </div>
                        )}

                        {stepperRef.current === DeviceTokenSteps.gotToken && (
                            <div
                                className={`flex flex-col h-full pt-8 gap-y-24 justify-center px-8`}>
                                <div className="flex flex-col justify-center gap-y-8">
                                    <div className="text-4xl text-success w-full text-center">
                                        Uspešna registracija
                                    </div>

                                    <div className="w-full text-center text-secondary-text text-xl">
                                        Uređaj je uspešno registrovan. Dobro
                                        došli u {BRAND_NAME} mrežu.
                                    </div>
                                </div>

                                <PrimaryButton
                                    text={'Nastavi'}
                                    callback={() => navigate('/')}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    )
}