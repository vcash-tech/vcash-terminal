import { useEffect, useState } from 'react'

import { timer } from '@/assets/icons'
import WireButton from '@/components/atoms/wireButton/wireButton'
import { useTranslate } from '@/i18n/useTranslate'

export default function SessionCounter({
    onEndSession
}: {
    onEndSession?: () => void
}) {
    const { t } = useTranslate()
    const [timeLeft, setTimeLeft] = useState(15)

    const sessionDuration = 15
    const maxSessionDuration = 30

    const extendTime = () => {
        setTimeLeft(timeLeft + sessionDuration)
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft <= 0) {
                if (onEndSession) {
                    onEndSession()
                }
                clearInterval(timer)
                return
            }
            setTimeLeft((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [onEndSession, timeLeft])

    return (
        <div className="session-counter">
            <div className="time-left">
                <img src={timer} alt="timer" />
                <p>
                    {t('sessionCounter.timeLeft')} <span>{timeLeft}s</span>
                </p>
            </div>
            <WireButton
                isDisabled={timeLeft > maxSessionDuration - sessionDuration}
                onClick={extendTime}>
                {t('sessionCounter.extendTime')}
            </WireButton>
        </div>
    )
}
