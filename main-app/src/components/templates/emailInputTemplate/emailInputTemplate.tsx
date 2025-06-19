import { useState } from 'react'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import FormContainer from '@/components/molecules/formContainer/formContainer'
import InputField from '@/components/molecules/inputField/inputField'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

import { emailCompleted, emailInputBackground } from '../../../assets/images'

export default function EmailInputTemplate({
    onComplete
}: {
    onComplete: () => void
}) {
    const [emailAddress, setEmailAddress] = useState('')
    const [isCompleted, setIsCompleted] = useState(false)

    const submitEmail = () => {
        // TODO: Validate email address
        // Send email to API
        // If successful, set isCompleted to true
        setIsCompleted(true)
    }
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
                <PrimaryButton text={t('emailInput.sendButton')} callback={submitEmail} />
            </FormContainer>
            {isCompleted && (
                <div
                    className={'email-input-completed'}
                    style={{
                        backgroundImage: `url(${emailInputBackground})`
                    }}>
                    <img src={emailCompleted} alt="Email Completed" className={'email-success-status'} />
                    <h1>
                        {t('emailInput.successMessage')}
                    </h1>
                    <PrimaryButton text={'Finish'} callback={onComplete} />
                </div>
            )}
            <Footer />
        </Container>
    )
}