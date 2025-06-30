import LanguageButton from '@/components/atoms/languageButton/languageButton'
import LinkBackButton from '@/components/atoms/linkBackButton/linkBackButton'
import { useTranslate } from '@/i18n/useTranslate'

import { flagEN, flagRS } from '../../../assets/icons'

type HeaderProps = {
    navigationBackText?: string
    navigateBackUrl?: string
}

const Header = ({ navigationBackText, navigateBackUrl }: HeaderProps) => {
    const { t, changeLanguage, isLanguageActive } = useTranslate()

    return (
        <header className="header">
            <div className="header-left">
                {navigationBackText && navigateBackUrl && (
                    <LinkBackButton
                        buttonText={navigationBackText || t('header.back')}
                        buttonUrl={navigateBackUrl}
                    />
                )}
            </div>
            <div className="header-right">
                <button
                    onClick={() => {
                        window.api.print(
                            'https://bp-templates.fly.dev/render/terminal_voucher?data=ewogICAgInVybCI6ICJodHRwczovL3ZjYXNoLnJzL3VybG1vcmFiaXRpbWFsb2R1emlkYWJpcHJlY2kvZHN0YXZpb2tha29jZWl6Z2xlZGF0aS9rYWRhc2V6YXByYXZva29yaXN0aXphbmVzdG9rb3Jpc25vc3RvdXNlYml1a2xqdWN1amVrb2R2YXVjZXJlYWlkcnVnZWtvcmlzbmVzdHZhcmkiLAogICAgInZvdWNoZXJDb2RlIjogIjEyMy00NTYtNzg5IiwKICAgICJwdWJsaWNDb2RlIjogIkFQVC1BUFQiLAogICAgInZlbnVlTmFtZSI6ICJUZXN0IFVwbGF0bm8gTWVzdG8iLAogICAgInZlbnVlQWRkcmVzcyI6ICJUZXN0IEFkcmVzYSIsCiAgICAidmVudWVDaXR5IjogIlRlc3QgZ3JhZCIsCiAgICAiYW1vdW50IjogIjEuMDAwIiwKICAgICJjdXJyZW5jeUNvZGUiOiAiUlNEIiwKICAgICJjcmVhdGVkQXQiOiAiMDQuMTAuMjAyMy4gMjM6MjgiLAogICAgImN1cnJlbnRUaW1lIjogIjA0LjEwLjIwMjIuIDIzOjI4Igp9&type=bmp'
                        )
                    }}>
                    Test štampe
                </button>
                <LanguageButton
                    flag={flagRS}
                    language="RS"
                    callback={() => changeLanguage('rs')}
                    active={isLanguageActive('rs')}
                />
                <LanguageButton
                    flag={flagEN}
                    language="EN"
                    callback={() => changeLanguage('en')}
                    active={isLanguageActive('en')}
                />
            </div>
        </header>
    )
}

export default Header
