import { useTranslate } from '@/i18n/useTranslate'

import { welcomeGift } from "../../../assets/icons"

// type WelcomeBannerProps = {};

export default function WelcomeBanner() {
  const { t } = useTranslate()

  return (
    <div className="welcome-banner">
      <img className="welcome-banner-icon" alt="gift-icon" src={welcomeGift} />
      <span className="welcome-banner-text-big">{t('welcome.title')}</span>
      <span className="welcome-banner-text-small">
        {t('welcome.text')}
      </span>
    </div>
  )
}
