import { useState } from 'react'

import { printerUnavailable } from '@/assets/icons'
import { qrCode } from '@/assets/images'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'

export type PrinterUnavailableModalProps = {
    isOpen: boolean
}

export default function PrinterUnavailableModal({ isOpen }: PrinterUnavailableModalProps) {
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="printer-unavailable-modal">
            <div className="modal-content">
                <IconHeading heading='Printer Unavailable' icon={printerUnavailable} />
                <p>You can still redeem your voucher — just scan the QR code below or send it to your email.</p>
                <img src={qrCode} className="qr-code" alt="QR Code" />
                <PrimaryButton text='Send to Email' callback={() => { setOpen(false) }} />
                <SessionCounter />
            </div>
        </div>
    )
}
