
import { useEffect, useState } from "react"

import WireButton from "@/components/atoms/wireButton/wireButton"

export default function SessionCounter() {
  const [timeLeft, setTimeLeft] = useState(15)
  
  const sessionDuration = 15
  const maxSessionDuration = 60

  const extendTime = () => {
    setTimeLeft(timeLeft + sessionDuration)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        // todo callback
        clearInterval(timer)
        return
      }
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  return (
    <div className="session-counter">
      <div className="time-left">Time left: <span>{timeLeft}s</span></div>
      <WireButton isDisabled={timeLeft > maxSessionDuration - sessionDuration} onClick={extendTime}>Extend Time</WireButton>
    </div>
  )
}
