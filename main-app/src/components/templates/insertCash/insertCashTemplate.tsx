import Container from "../../atoms/container/container";
import { insertCash } from "../../../assets/images";
import { infoCircle } from "../../../assets/icons";
import Header from "../../organisms/header/header";
import Footer from "../../organisms/footer/footer";
import PrimaryButton from "../../atoms/primaryButton/primaryButton";

export default function PaymentMethodTerminalTemplate() {
  return <Container>
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
  </Container>;
}
