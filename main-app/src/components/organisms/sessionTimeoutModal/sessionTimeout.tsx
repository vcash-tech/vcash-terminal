import { useNavigate } from 'react-router-dom'

import { sessionExpired } from '@/assets/icons'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'
import { useNavigationContext } from '@/hooks'
import { useTranslate } from '@/i18n/useTranslate'
import { useOrder } from '@/providers'

export default function SessionTimeout() {
    const { t } = useTranslate()
    const navigate = useNavigate()
    const { startUrl } = useNavigationContext()
    const { state, setShouldShowAreYouThere } = useOrder()

    if (!state.shouldShowAreYouThere) {
        return <></>
    }

    return (
        <div className="session-timeout-modal">
            <div className="modal-content">
                <IconHeading
                    heading={t('sessionTimeoutModal.title')}
                    icon={sessionExpired}
                />
                <p>{t('sessionTimeoutModal.subtitle')}</p>
                <SessionCounter
                    onEndSession={() => {
                        console.log('Session ended')
                        setShouldShowAreYouThere(false)
                        navigate(startUrl ?? '/welcome')
                    }}
                />
                <PrimaryButton
                    text={t('sessionTimeoutModal.buttonText')}
                    callback={() => {
                        setShouldShowAreYouThere(false)
                    }}
                />
            </div>
        </div>
    )
}
