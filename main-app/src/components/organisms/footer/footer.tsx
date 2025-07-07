import { useTranslate } from '@/i18n/useTranslate'

const Footer = () => {
  const { t } = useTranslate()
  return (
    <footer className="footer">{t('footer.contactSupport')} <span>069 88 85 558</span></footer>
  )
}

export default Footer
