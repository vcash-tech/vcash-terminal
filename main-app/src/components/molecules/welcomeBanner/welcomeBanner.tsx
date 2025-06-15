import { welcomeGift } from "../../../assets/icons";

// type WelcomeBannerProps = {};

export default function WelcomeBanner() {
  return (
    <div className="welcome-banner">
      <img className="welcome-banner-icon" alt="gift-icon" src={welcomeGift} />
      <span className="welcome-banner-text-big">Welcome to VouchMate</span>
      <span className="welcome-banner-text-small">
        Buy vouchers, pay bills, or top up digital services in a few taps.
      </span>
    </div>
  );
}
