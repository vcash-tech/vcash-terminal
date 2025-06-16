import Container from "@/components/atoms/container/container"
import PrimaryButton from "@/components/atoms/primaryButton/primaryButton"
import Footer from "@/components/organisms/footer/footer"
import Header from "@/components/organisms/header/header"

import { ageDisclaimer } from "../../../assets/icons"

export default function AgeDisclaimerTemplate() {
  return <Container isFullHeight={true}>
    <Header navigateBackUrl="#" navigationBackText="Back to Services" />
    <div className="age-disclaimer">
      <img src={ageDisclaimer} alt="Age Disclaimer" className="age-disclaimer-icon" />
      <h1>18+ voucher purchase disclaimer</h1>
      <h2>This kiosk provides access to betting services intended for users aged 18 and above only. By proceeding, you confirm that you are of legal age and understand the risks associated with gambling. Please play responsibly.</h2>
      <PrimaryButton text="Continue to Purchase" callback={() => console.log("Age confirmed")} />
    </div>
    <Footer />
  </Container>
}
