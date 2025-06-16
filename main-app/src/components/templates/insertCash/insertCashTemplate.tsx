import Container from "@/components/atoms/container/container"
import PrimaryButton from "@/components/atoms/primaryButton/primaryButton"
import Footer from "@/components/organisms/footer/footer"
import Header from "@/components/organisms/header/header"

import { infoCircle } from "../../../assets/icons"
import { insertCash } from "../../../assets/images"

export default function PaymentMethodTerminalTemplate() {
  return <Container fullHeight={true}>
    <Header />
    <div className="insert-cash">
      <h1>Insert cash</h1>
      <h2>Accepted notes: 500 RSD and above</h2>
      <img src={insertCash} alt="Insert cash" />
      <div className="inserted-amount">Inserted Amount: <span>500 RSD</span></div>
      <div className="info-box"><img src={infoCircle} alt="Info" />The machine does not return change Refunds are not available.</div>
      <PrimaryButton text="Confirm Payment" callback={() => console.log("Payment confirmed")} />
    </div>
    <Footer />
  </Container>
}
