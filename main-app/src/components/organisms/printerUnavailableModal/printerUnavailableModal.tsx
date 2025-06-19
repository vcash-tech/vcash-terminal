import { useState } from 'react'

import { printerUnavailable } from '@/assets/icons'
import { qrCode } from '@/assets/images'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'
import { useTranslate } from '@/i18n/useTranslate'

export type PrinterUnavailableModalProps = {
    isOpen: boolean
}

export default function PrinterUnavailableModal({ isOpen }: PrinterUnavailableModalProps) {
    const { t } = useTranslate()
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="printer-unavailable-modal">
            <div className="modal-content">
                <IconHeading heading={t('printerUnavailableModal.title')} icon={printerUnavailable} />
                <p>{t('printerUnavailableModal.subtitle')}</p>
                <img src={qrCode} className="qr-code" alt="QR Code" />
                <PrimaryButton text={t('printerUnavailableModal.buttonText')} callback={() => { setOpen(false) }} />
                <SessionCounter />
            </div>
        </div>
    )
}
