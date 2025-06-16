import { useEffect,useState } from 'react'

import Container from "@/components/atoms/container/container"
import GeneratingProgress from  "@/components/atoms/generatingProgress/generatingProgress"
import Footer from "@/components/organisms/footer/footer"
import Header from "@/components/organisms/header/header"

export default function PaymentSuccessfulTemplate() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1))
    }, 100)
    return () => clearInterval(timer)
  }, [])

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
  </Container>
}
