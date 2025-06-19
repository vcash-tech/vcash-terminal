import { useNavigate } from "react-router-dom"

import Container from "@/components/atoms/container/container"
import PaymentCard from "@/components/atoms/paymentCard/paymentCard"
import Footer from "@/components/organisms/footer/footer"
import Header from "@/components/organisms/header/header"
import { useTranslate } from '@/i18n/useTranslate'

import { cashPayment, creditCardPayment } from "../../../assets/images"

export default function PaymentMethodTerminalTemplate() {
  const navigate = useNavigate()
  const { t } = useTranslate()

  return <Container isFullHeight={true}>
    <Header navigateBackUrl="#" navigationBackText={t('selectPaymentMethod.backToServices')} />
    <div className="payment-method-terminal">
      <h1>{t('selectPaymentMethod.title')}</h1>
      <h2>{t('selectPaymentMethod.subtitle')}</h2>
      <div className="payment-methods">
      <PaymentCard
        image={creditCardPayment}
        text={t('selectPaymentMethod.cardPayment')}
        callback={() => console.log("Card payment selected")}
      />
      <PaymentCard
        image={cashPayment}
        text={t('selectPaymentMethod.cashPayment')}
        callback={() => navigate('/buy-voucher-cash')}
      />
      </div>
    </div>
    <Footer />
  </Container>
}
