import { useState } from 'react'

import { qrCode } from '@/assets/images'
import WireButton from '@/components/atoms/wireButton/wireButton'
import { useTranslate } from '@/i18n/useTranslate'

export type QrCodeModalProps = {
    isOpen: boolean
    onClose: () => void
}

export default function QrCodeModal({ isOpen, onClose }: QrCodeModalProps) {
    const { t } = useTranslate()
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="qr-code-modal">
            <div className="modal-content">
                <p>
                    {t('qrModal.title')}
                </p>
                <img src={qrCode} className="qr-code" alt="QR Code" />
                <WireButton
                    onClick={() => {
                        setOpen(false)
                        onClose()
                    }}>
                    {t('qrModal.back')}
                </WireButton>
            </div>
        </div>
    )
}
