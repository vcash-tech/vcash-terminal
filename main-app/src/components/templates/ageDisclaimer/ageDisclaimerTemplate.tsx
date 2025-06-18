import { useNavigate } from "react-router-dom"

import Container from "@/components/atoms/container/container"
import PrimaryButton from "@/components/atoms/primaryButton/primaryButton"
import Footer from "@/components/organisms/footer/footer"
import Header from "@/components/organisms/header/header"
import { useTranslate } from '@/i18n/useTranslate'

import { ageDisclaimer } from "../../../assets/icons"

export default function AgeDisclaimerTemplate() {
  const navigate = useNavigate()
  const { t } = useTranslate()

  return <Container isFullHeight={true}>
    <Header navigateBackUrl="#" navigationBackText={t('ageDisclaimer.backToServices')} />
    <div className="age-disclaimer">
      <img src={ageDisclaimer} alt="Age Disclaimer" className="age-disclaimer-icon" />
      <h1>{t('ageDisclaimer.title')}</h1>
      <h2>{t('ageDisclaimer.subtitle')}</h2>
      <PrimaryButton text={t('ageDisclaimer.continuePurchase')} callback={() => navigate('/payment-method')} />
    </div>
    <Footer />
  </Container>
}
