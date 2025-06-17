import { useState } from 'react'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import InputField from '@/components/molecules/inputField/inputField'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'

import { emailCompleted, emailInputBackground } from '../../../assets/images'

export default function EmailInputTemplate({
    onComplete
}: {
    onComplete: () => void
}) {
    const [emailAddress, setEmailAddress] = useState('')
    const [isCompleted, setIsCompleted] = useState(true)

    const submitEmail = () => {
        // TODO: Validate email address
        // Send email to API
        // If successful, set isCompleted to true
        setIsCompleted(true)
    }

    return (
        <>
            <Container isFullHeight={true}>
                <Header />
                {!isCompleted && (
                    <div
                        className={'email-input'}
                        style={{
                            backgroundImage: `url(${emailInputBackground})`
                        }}>
                        <div className={'title-section'}>
                            <h1>Send voucher via email</h1>
                            <p>
                                We'll email your voucher - just drop your
                                address below
                            </p>
                        </div>

                        <InputField
                            placeholder="Email Address"
                            onChange={(_id, value) => {
                                setEmailAddress(value)
                            }}
                            id="email"
                            value={emailAddress}
                            disableAutofill={true}
                        />
                        <PrimaryButton
                            text={'Send Email'}
                            callback={submitEmail}
                        />
                    </div>
                )}
                {isCompleted && (
                    <div
                        className={'email-input-completed'}
                        style={{
                            backgroundImage: `url(${emailInputBackground})`
                        }}>
                        <img src={emailCompleted} alt="Email Completed" className={'email-success-status'} />
                        <h1>
                            Great! The voucher has been delivered to your
                            inbox!
                        </h1>
                        <PrimaryButton text={'Finish'} callback={onComplete} />
                    </div>
                )}
                <Footer />
            </Container>
        </>
    )
}