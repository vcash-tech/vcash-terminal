
import { useEffect, useState } from "react"

import WireButton from "@/components/atoms/wireButton/wireButton"
import { useTranslate } from '@/i18n/useTranslate'

export default function SessionCounter({ 
  onEndSession
}: {
  onEndSession?: () => void
}) {
  const { t } = useTranslate()
  const [timeLeft, setTimeLeft] = useState(15)
  
  const sessionDuration = 15
  const maxSessionDuration = 60

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
      <div className="time-left">{t('sessionCounter.timeLeft')} <span>{timeLeft}s</span></div>
      <WireButton isDisabled={timeLeft > maxSessionDuration - sessionDuration} onClick={extendTime}>{t('sessionCounter.extendTime')}</WireButton>
    </div>
  )
}
