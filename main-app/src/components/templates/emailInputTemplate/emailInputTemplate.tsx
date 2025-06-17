import { useState } from 'react'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import InputField from '@/components/molecules/inputField/inputField'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'

export default function EmailInputTemplate() {
    const [emailAddress, setEmailAddress] = useState('')

    return (
        <>
            <Container isFullHeight={true}>
                <Header />
                <div className={'email-input'}>
                    <h1>Send voucher via email</h1>
                    <p>
                        We'll email your voucher - just drop your address below
                    </p>

                    <InputField
                        placeholder="Email Address"
                        onChange={(_id, value) => {
                            setEmailAddress(value)
                        }}
                        id="email"
                        value={emailAddress}
                        disableAutofill={true}
                    />
                    <PrimaryButton text={'Send Email'} />
                </div>
                <Footer />
            </Container>
        </>
    )
}