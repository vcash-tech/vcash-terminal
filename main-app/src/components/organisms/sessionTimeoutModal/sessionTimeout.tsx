import { useState } from 'react'

import { sessionExpired } from '@/assets/icons'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'

export type PrinterUnavailableModalProps = {
    isOpen: boolean
}

export default function SessionTimeout({ isOpen }: PrinterUnavailableModalProps) {
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="session-timeout-modal">
            <div className="modal-content">
                <IconHeading heading='Session Timeout' icon={sessionExpired} />
                <p>For your security, the session has expired due to inactivity. Please start again to continue.</p>
                <PrimaryButton text='Start Again' callback={() => { setOpen(false) }} />
            </div>
        </div>
    )
}
