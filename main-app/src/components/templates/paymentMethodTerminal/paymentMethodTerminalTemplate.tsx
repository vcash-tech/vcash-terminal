import Container from "../../atoms/container/container";
import PaymentCard from "../../atoms/paymentCard/paymentCard";
import { cashPayment, creditCardPayment } from "../../../assets/images";
import Header from "../../organisms/header/header";
import Footer from "../../organisms/footer/footer";

export default function PaymentMethodTerminalTemplate() {
  return <Container fullHeight={true}>
    <Header navigateBackUrl="#" navigationBackText="Back to Services" />
    <div className="payment-method-terminal">
      <h1>Select your Payment Method</h1>
      <h2>Choose a method to complete your Purchase</h2>
      <div className="payment-methods">
      <PaymentCard
        image={creditCardPayment}
        text="Card Payment"
        callback={() => console.log("Card payment selected")}
      />
      <PaymentCard
        image={cashPayment}
        text="Cash Payment"
        callback={() => console.log("Cash payment selected")}
      />
      </div>
    </div>
    <Footer />
  </Container>;
}
