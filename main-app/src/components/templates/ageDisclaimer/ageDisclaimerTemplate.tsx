import Container from "../../atoms/container/container";
import Header from "../../organisms/header/header";
import Footer from "../../organisms/footer/footer";
import { ageDisclaimer } from "../../../assets/icons";
import PrimaryButton from "../../atoms/primaryButton/primaryButton";

export default function AgeDisclaimerTemplate() {
  return <Container>
    <Header navigateBackUrl="#" navigationBackText="Back to Services" />
    <div className="age-disclaimer">
      <img src={ageDisclaimer} alt="Age Disclaimer" className="age-disclaimer-icon" />
      <h1>18+ voucher purchase disclaimer</h1>
      <h2>This kiosk provides access to betting services intended for users aged 18 and above only. By proceeding, you confirm that you are of legal age and understand the risks associated with gambling. Please play responsibly.</h2>
      <PrimaryButton text="Continue to Purchase" callback={() => console.log("Age confirmed")} />
    </div>
    <Footer />
  </Container>;
}
