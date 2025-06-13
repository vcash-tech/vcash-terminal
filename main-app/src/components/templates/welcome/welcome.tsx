import { welcomeBackground } from "../../../assets/images";
import WelcomeScreen from "../../organisms/welcomeScreen/welcomeScreen";

export default function Welcome() {
  return (
    <div className="welcome">
      <WelcomeScreen />
      <img src={welcomeBackground} />
    </div>
  );
}
