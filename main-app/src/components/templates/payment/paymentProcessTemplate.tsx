import Container from "../../atoms/container/container";
import { insertCash } from "../../../assets/images";

export default function PaymentProcessTemplate() {
  return <Container>
    <h1>Insert Your Card</h1>
    <img src={insertCash} />
  </Container>;
}
