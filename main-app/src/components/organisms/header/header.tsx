import { useEffect } from 'react'

import LanguageButton from '@/components/atoms/languageButton/languageButton'
import LinkBackButton from '@/components/atoms/linkBackButton/linkBackButton'
import Debug from '@/components/organisms/debug'
import { useLocale } from '@/hooks/useLocale'
import { useTranslate } from '@/i18n/useTranslate'

import { flagEN, flagRS } from '../../../assets/icons'

type HeaderProps = {
    navigationBackText?: string
    navigateBackUrl?: string
    isWelcome?: boolean
    shouldResetLanguage?: boolean
}

const Header = ({
    navigationBackText,
    navigateBackUrl,
    isWelcome,
    shouldResetLanguage,
}: HeaderProps) => {
    const { changeLanguage, currentLanguage } = useLocale()
    const { t } = useTranslate()

    useEffect(() => {
        if (shouldResetLanguage) {
            changeLanguage('rs')
        }
    }, [shouldResetLanguage, changeLanguage])

    return (
        <header className={`header ${isWelcome ? 'welcome-no-border' : ''}`}>
            <div className="header-left">
                <Debug />

                {navigationBackText && navigateBackUrl && (
                    <LinkBackButton
                        buttonText={navigationBackText || t('header.back')}
                        buttonUrl={navigateBackUrl}
                    />
                )}
            </div>
            <div className="header-right">
                <LanguageButton
                    flag={flagRS}
                    language="RS"
                    callback={() => changeLanguage('rs')}
                    active={currentLanguage === 'rs'}
                />
                <LanguageButton
                    flag={flagEN}
                    language="EN"
                    callback={() => changeLanguage('en')}
                    active={currentLanguage === 'en'}
                />
            </div>
        </header>
    )
}

export default Header
