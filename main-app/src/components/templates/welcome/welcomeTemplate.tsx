import WelcomeScreen from "@/components/organisms/welcomeScreen/welcomeScreen"

import { welcomeBackground } from "../../../assets/images"

export default function Welcome() {
  return (
    <div className="welcome">
      <WelcomeScreen />
      <img src={welcomeBackground} />
    </div>
  )
}
