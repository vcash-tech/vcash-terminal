import { useState } from 'react'

import { warningIcon } from '@/assets/icons'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'

export type CashboxFullModalProps = {
    isOpen: boolean
}

export default function CashboxFullModal({ isOpen }: CashboxFullModalProps) {
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="cashbox-full-modal">
            <div className="modal-content">
                <IconHeading heading='Kiosk Cashbox Full' icon={warningIcon} />
                <p>The cash deposit limit has been reached. You can generate a voucher for the amount you've inserted so far.</p>
                <PrimaryButton text='Issue Voucher' callback={() => { setOpen(false) }} />
            </div>
        </div>
    )
}
