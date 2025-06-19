import { useTranslate } from '@/i18n/useTranslate'

const Footer = () => {
  const { t } = useTranslate()
  return (
    <footer className="footer">{t('footer.contactSupport')} <span>0800 123 456</span></footer>
  )
}

export default Footer
