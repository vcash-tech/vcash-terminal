import { useTranslate } from '@/i18n/useTranslate'

interface FooterProps {
    isWelcome?: boolean
}

const Footer = ({ isWelcome = false }: FooterProps) => {
    const { t } = useTranslate()

    return (
        <footer className={`footer ${isWelcome ? 'footer--welcome' : ''}`}>
            {t('footer.contactSupport')} <span></span>
            <span className="email">062 111 5 111</span>
            {t('footer.contactSupport2')}{' '}
            <span className="email">podrska@vcash.rs</span>
        </footer>
    )
}

export default Footer
