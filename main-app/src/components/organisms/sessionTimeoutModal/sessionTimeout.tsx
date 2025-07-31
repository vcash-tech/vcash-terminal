import { sessionExpired } from '@/assets/icons'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'
import { useTranslate } from '@/i18n/useTranslate'

export type PrinterUnavailableModalProps = {
    isOpen: boolean,
    onEndSession: () => void
    onClose: () => void
}

export default function SessionTimeout({ isOpen, onEndSession, onClose }: PrinterUnavailableModalProps) {
    const { t } = useTranslate()

    if (!isOpen) {
        return <></>
    }

    return (
        <div className="session-timeout-modal">
            <div className="modal-content">
                <IconHeading heading={t('sessionTimeoutModal.title')} icon={sessionExpired} />
                <p>{t('sessionTimeoutModal.subtitle')}</p>
                <SessionCounter onEndSession={onEndSession} />
                <PrimaryButton text={t('sessionTimeoutModal.buttonText')} callback={onClose} />
            </div>
        </div>
    )
}
