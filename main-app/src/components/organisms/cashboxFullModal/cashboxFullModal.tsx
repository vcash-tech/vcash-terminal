import { useState } from 'react'

import { warningIcon } from '@/assets/icons'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { useTranslate } from '@/i18n/useTranslate'

export type CashboxFullModalProps = {
    isOpen: boolean
}

export default function CashboxFullModal({ isOpen }: CashboxFullModalProps) {
    const { t } = useTranslate()
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="cashbox-full-modal">
            <div className="modal-content">
                <IconHeading heading={t('cashboxFullModal.title')} icon={warningIcon} />
                <p>{t('cashboxFullModal.subtitle')}</p>
                <PrimaryButton text={t('cashboxFullModal.buttonText')} callback={() => { setOpen(false) }} />
            </div>
        </div>
    )
}
