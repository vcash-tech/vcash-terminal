import { useEffect, useState } from 'react'

import { warningIcon } from '@/assets/icons'
import { useTranslate } from '@/i18n/useTranslate'

export interface ErrorNotificationProps {
    message: string
    isVisible: boolean
    onClose: () => void
    autoCloseMs?: number
}

export default function ErrorNotification({
    message,
    isVisible,
    onClose,
    autoCloseMs = 5000
}: ErrorNotificationProps) {
    const { t } = useTranslate()
    const [show, setShow] = useState(isVisible)

    useEffect(() => {
        setShow(isVisible)

        if (isVisible && autoCloseMs > 0) {
            const timer = setTimeout(() => {
                setShow(false)
                onClose()
            }, autoCloseMs)

            return () => clearTimeout(timer)
        }
    }, [isVisible, autoCloseMs, onClose])

    if (!show) {
        return null
    }

    return (
        <div className="error-notification">
            <div className="error-content">
                <img src={warningIcon} alt={t('common.info')} />
                <span>{message}</span>
                <button
                    onClick={() => {
                        setShow(false)
                        onClose()
                    }}
                    className="close-button">
                    ×
                </button>
            </div>
        </div>
    )
}
