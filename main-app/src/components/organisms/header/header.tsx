import LanguageButton from '@/components/atoms/languageButton/languageButton'
import LinkBackButton from '@/components/atoms/linkBackButton/linkBackButton'
import { useTranslate } from '@/i18n/useTranslate'
import { apiService } from '@/services/apiService'

import { flagEN, flagRS } from '../../../assets/icons'

type HeaderProps = {
    navigationBackText?: string
    navigateBackUrl?: string
    isWelcome?: boolean
}

const Header = ({
    navigationBackText,
    navigateBackUrl,
    isWelcome
}: HeaderProps) => {
    const { t, changeLanguage, isLanguageActive } = useTranslate()

    const handlePrintDebug = async () => {
        alert('About to call apiService.print() with template URL...')

        const templateUrl =
            'https://bp-templates.fly.dev/render/terminal_voucher?data=ewogICAgInVybCI6ICJodHRwczovL3ZjYXNoLnJzL3VybG1vcmFiaXRpbWFsb2R1emlkYWJpcHJlY2kvZHN0YXZpb2tha29jZWl6Z2xlZGF0aS9rYWRhc2V6YXByYXZva29yaXN0aXphbmVzdG9rb3Jpc25vc3RvdXNlYml1a2xqdWN1amVrb2R2YXVjZXJlYWlkcnVnZWtvcmlzbmVzdHZhcmkiLAogICAgInZvdWNoZXJDb2RlIjogIjEyMy00NTYtNzg5IiwKICAgICJwdWJsaWNDb2RlIjogIkFQVC1BUFQiLAogICAgInZlbnVlTmFtZSI6ICJUZXN0IFVwbGF0bm8gTWVzdG8iLAogICAgInZlbnVlQWRkcmVzcyI6ICJUZXN0IEFkcmVzYSIsCiAgICAidmVudWVDaXR5IjogIlRlc3QgZ3JhZCIsCiAgICAiYW1vdW50IjogIjEuMDAwIiwKICAgICJjdXJyZW5jeUNvZGUiOiAiUlNEIiwKICAgICJjcmVhdGVkQXQiOiAiMDQuMTAuMjAyMy4gMjM6MjgiLAogICAgImN1cnJlbnRUaW1lIjogIjA0LjEwLjIwMjIuIDIzOjI4Igp9&type=bmp&rotate=180'

        try {
            const response = await apiService.print(templateUrl)
            alert(`Print response: ${JSON.stringify(response, null, 2)}`)
        } catch (error) {
            alert(
                `Print error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    const handleGetCredentialsDebug = async () => {
        alert('About to call apiService.getCredentials()...')

        try {
            const response = await apiService.getCredentials()
            alert(`Credentials response: ${JSON.stringify(response, null, 2)}`)
        } catch (error) {
            alert(
                `Credentials error: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    return (
        <header className={`header ${isWelcome ? 'welcome-no-border' : ''}`}>
            <div className="header-left">
                {navigationBackText && navigateBackUrl && (
                    <LinkBackButton
                        buttonText={navigationBackText || t('header.back')}
                        buttonUrl={navigateBackUrl}
                    />
                )}
                {/* Debug buttons */}
                <>
                    <button
                        onClick={handlePrintDebug}
                        style={{
                            marginLeft: '10px',
                            padding: '5px 10px',
                            background: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}>
                        Debug Print
                    </button>
                    <button
                        onClick={handleGetCredentialsDebug}
                        style={{
                            marginLeft: '5px',
                            padding: '5px 10px',
                            background: '#4ecdc4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}>
                        Debug Credentials
                    </button>
                </>
            </div>
            <div className="header-right">
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
