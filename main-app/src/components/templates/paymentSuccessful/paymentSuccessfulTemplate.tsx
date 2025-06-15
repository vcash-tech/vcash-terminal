import { useState, useEffect } from 'react';
import Container from "../../atoms/container/container";
import Header from "../../organisms/header/header";
import Footer from "../../organisms/footer/footer";
import GeneratingProgress from  "../../atoms/generatingProgress/generatingProgress";

export default function PaymentSuccessfulTemplate() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return <Container isFullHeight={true}>
    <Header />
    <div className="payment-successful">
      <h1>Payment Successful</h1>
      <h2>Please be patient, while we Printing your Voucher</h2>
      <div className="progress-bar">
        <GeneratingProgress progress={progress} text="Generating voucher..." />
      </div>
    </div>
    <Footer />
  </Container>;
}
