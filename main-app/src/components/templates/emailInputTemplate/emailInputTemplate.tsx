import { useState } from 'react'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import FormContainer from '@/components/molecules/formContainer/formContainer'
import InputField from '@/components/molecules/inputField/inputField'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

export default function EmailInputTemplate() {
    const [emailAddress, setEmailAddress] = useState('')
    const { t } = useTranslate()

    return (
        <Container isFullHeight={true}>
            <Header />
            <FormContainer className="email-input">
                <div className={'title-section'}>
                    <h1>{t('emailInput.title')}</h1>
                    <p>{t('emailInput.description')}</p>
                </div>

                <InputField
                    placeholder={t('emailInput.emailPlaceholder')}
                    onChange={(_id, value) => {
                        setEmailAddress(value)
                    }}
                    id="email"
                    value={emailAddress}
                    disableAutofill={true}
                />
                <PrimaryButton text={t('emailInput.sendButton')} />
            </FormContainer>
            <Footer />
        </Container>
    )
}