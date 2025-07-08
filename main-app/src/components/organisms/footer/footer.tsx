import { useTranslate } from '@/i18n/useTranslate'

interface FooterProps {
    isWelcome?: boolean
}

const Footer = ({ isWelcome = false }: FooterProps) => {
    const { t } = useTranslate()

    return (
        <footer className={`footer ${isWelcome ? 'footer--welcome' : ''}`}>
            {t('footer.contactSupport')} <span>069 888 55 58</span>
        </footer>
    )
}

export default Footer
