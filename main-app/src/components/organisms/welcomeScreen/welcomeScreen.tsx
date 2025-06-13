import PeekButton from "../../atoms/peekButton/peekButton";
import WelcomeBanner from "../../molecules/welcomeBanner/welcomeBanner";
import { arrowRight } from "../../../assets/icons";

type WelcomeScreenProps = {};

export default function WelcomeScreen({}: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <WelcomeBanner />
      <div className="welcome-screen-button-container">
        <PeekButton
          buttonContent={
            <div className="welcome-screen-button-content">
              <span>Get Started</span>
              <img alt="right-arrow" src={arrowRight} />
            </div>
          }
          handleClick={() => {}}
        />
      </div>
    </div>
  );
}
