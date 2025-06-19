import { LinearProgress } from '@mui/material'
import { useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { deviceIcon, userIcon } from '@/assets/icons'
import Container from '@/components/atoms/container/container'
import Input from '@/components/atoms/input/input'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { DeviceTokenSteps } from '@/data/enums/deviceTokenSteps'
import { useTranslate } from '@/i18n/useTranslate'

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
    const { t } = useTranslate()
    const [agentEmail, setAgentEmail] = useState(email)
    const [deviceName, setDeviceName] = useState(device)
    const [isFocused, setIsFocused] = useState(false)

    return (
        <Container isFullHeight={true}>
            <Header />
            <div
                className={`register-container ${isFocused ? 'active-keyboard' : ''}`}>
                <div className="card">
                    <div className="flex flex-col h-full last:pb-[8rem]">
                        <div className="flex justify-center desktop:justify-start w-full pt-12 pb-6">
                            <h1>{t('register.title')}</h1>
                        </div>

                        {/* Form and Button container */}
                        {stepper === DeviceTokenSteps.getCode && (
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
                                            placeholder={t(
                                                'register.emailPlaceholder'
                                            )}
                                            onFocus={(isFocused) => {
                                                setIsFocused(isFocused)
                                            }}
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
                                            placeholder={t(
                                                'register.deviceNamePlaceholder'
                                            )}
                                            onFocus={(isFocused) => {
                                                setIsFocused(isFocused)
                                            }}
                                        />
                                    </div>
                                </div>

                                <PrimaryButton
                                    text={t('register.registerDevice')}
                                    callback={onRegister}
                                />
                            </div>
                        )}

                        {stepper === DeviceTokenSteps.gettingToken && (
                            <div
                                className={`flex flex-col h-full gap-y-12 justify-center realtive`}>
                                <div className="flex flex-col justify-center px-8">
                                    <div className="text-4xl text-primary w-full text-center">
                                        {t('register.waitingForApproval')}
                                    </div>

                                    <div className="w-full text-center text-secondary-text text-xl mt-12">
                                        {t('register.approvalPending', {
                                            brandName: BRAND_NAME
                                        })}
                                    </div>

                                    {/* <div className="flex justify-center mt-16">
                          <span
                              className="text-link text-2xl cursor-pointer p-4"
                              onClick={() =>
                                  setStepper(DeviceTokenSteps.getCode)
                              }
                          >
                              {t('register.tryAgain')}
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

                        {stepper === DeviceTokenSteps.gotToken && (
                            <div
                                className={`flex flex-col h-full pt-8 gap-y-24 justify-center px-8`}>
                                <div className="flex flex-col justify-center gap-y-8">
                                    <div className="text-4xl text-success w-full text-center">
                                        {t('register.successfulRegistration')}
                                    </div>

                                    <div className="w-full text-center text-secondary-text text-xl">
                                        {t('register.welcomeMessage', {
                                            brandName: BRAND_NAME
                                        })}
                                    </div>
                                </div>

                                <PrimaryButton
                                    text={t('register.continue')}
                                    callback={() => navigate('/welcome')}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                className={`keyboard-container ${isFocused ? 'active-keyboard' : ''}`}>
                <Footer />
            </div>
        </Container>
    )
}
