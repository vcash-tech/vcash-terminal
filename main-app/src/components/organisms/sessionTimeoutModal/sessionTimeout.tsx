import { useState } from 'react'

import { sessionExpired } from '@/assets/icons'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { useTranslate } from '@/i18n/useTranslate'

export type PrinterUnavailableModalProps = {
    isOpen: boolean
}

export default function SessionTimeout({ isOpen }: PrinterUnavailableModalProps) {
    const { t } = useTranslate()
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="session-timeout-modal">
            <div className="modal-content">
                <IconHeading heading={t('sessionTimeoutModal.title')} icon={sessionExpired} />
                <p>{t('sessionTimeoutModal.subtitle')}</p>
                <PrimaryButton text={t('sessionTimeoutModal.buttonText')} callback={() => { setOpen(false) }} />
            </div>
        </div>
    )
}
