import Container from "@/components/atoms/container/container"
import PaymentCard from "@/components/atoms/paymentCard/paymentCard"
import Footer from "@/components/organisms/footer/footer"
import Header from "@/components/organisms/header/header"

import { cashPayment, creditCardPayment } from "../../../assets/images"
import { useNavigate } from "react-router-dom"

export default function PaymentMethodTerminalTemplate() {
  const navigate = useNavigate()
  return <Container isFullHeight={true}>
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
        callback={() => navigate('/buy-voucher-cash')}
      />
      </div>
    </div>
    <Footer />
  </Container>
}
