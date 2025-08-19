import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { logoBlue, welcome_betting_balkanBet, welcome_betting_maxBet, welcome_betting_meridianBet, welcome_betting_merkurXtip, welcome_betting_soccerBet, welcome_gaming_playStation, welcome_gaming_roblox, welcome_gaming_steam, welcome_gaming_xBox, welcome_ips_katastar, welcome_ips_komunalije, welcome_ips_mup, welcome_ips_struja, welcome_ips_telefon } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import ServicesDark from '@/components/molecules/serviceDark/serviceDark'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useCheckInternetConnection } from '@/hooks/useCheckInternetConnection'

export default function WelcomeWithServices({ navigate }: { navigate: NavigateFunction }) {
    const { t } = useTranslation()
    const { isOnline } = useCheckInternetConnection({ shouldCheck: true })
    const [currentService, setCurrentService] = useState<string>('')

    return (
        <Container style={{ gap: 0 }} isFullHeight={true}>
            <div className="welcome-with-services">
                <Header isWelcome={true} shouldResetLanguage={true} />
                <div className='container'>
                    <div className="vcash-logo">
                        <img src={logoBlue} alt="" />
                    </div>
                    <h1> {t('welcome.dark.title')}</h1>
                    
                    <ServicesDark 
                        title='welcome.dark.betting.title'
                        subtitle='welcome.dark.betting.subtitle'
                        type='betting'
                        hasAgeDisclamer={true}
                        isCommingSoon={false}
                        isSelected={currentService==='betting'}
                        images={[
                            {src: welcome_betting_soccerBet, isCommingSoon: false},
                            {src: welcome_betting_balkanBet, isCommingSoon: false},
                            {src: welcome_betting_merkurXtip, isCommingSoon: false},
                            {src: welcome_betting_maxBet, isCommingSoon: true},
                            {src: welcome_betting_meridianBet, isCommingSoon: true},
                            {src: welcome_betting_soccerBet, isCommingSoon: false},
                            {src: welcome_betting_balkanBet, isCommingSoon: false},
                            {src: welcome_betting_merkurXtip, isCommingSoon: false},
                            {src: welcome_betting_maxBet, isCommingSoon: true},
                            {src: welcome_betting_meridianBet, isCommingSoon: true}
                        ]}
                        onClick={() => {  setCurrentService(currentService !== 'betting' ? 'betting' : '') }}
                    />

                    <ServicesDark 
                        title='welcome.dark.gaming.title'
                        subtitle='welcome.dark.gaming.subtitle'
                        type='gaming'
                        hasAgeDisclamer={false}
                        isCommingSoon={true}
                        isSelected={currentService==='gaming'}
                        images={[
                            {src: welcome_gaming_playStation, isCommingSoon: false},
                            {src: welcome_gaming_steam, isCommingSoon: false},
                            {src: welcome_gaming_xBox, isCommingSoon: false},
                            {src: welcome_gaming_roblox, isCommingSoon: false},
                            {src: welcome_gaming_playStation, isCommingSoon: false},
                            {src: welcome_gaming_steam, isCommingSoon: false},
                            {src: welcome_gaming_xBox, isCommingSoon: false},
                            {src: welcome_gaming_roblox, isCommingSoon: false}
                        ]}
                        onClick={() => {  setCurrentService(currentService !== 'gaming' ? 'gaming' : '') }}
                    />

                    <ServicesDark 
                        title='welcome.dark.ips.title'
                        subtitle='welcome.dark.ips.subtitle'
                        type='ips'
                        hasAgeDisclamer={false}
                        isCommingSoon={true}
                        isSelected={currentService==='ips'}
                        images={[
                            {src: welcome_ips_struja, isCommingSoon: false},
                            {src: welcome_ips_telefon, isCommingSoon: false},
                            {src: welcome_ips_komunalije, isCommingSoon: false},
                            {src: welcome_ips_mup, isCommingSoon: false},
                            {src: welcome_ips_katastar, isCommingSoon: false},
                            {src: welcome_ips_struja, isCommingSoon: false},
                            {src: welcome_ips_telefon, isCommingSoon: false},
                            {src: welcome_ips_komunalije, isCommingSoon: false},
                            {src: welcome_ips_mup, isCommingSoon: false},
                            {src: welcome_ips_katastar, isCommingSoon: false}
                        ]}
                        onClick={() => {  setCurrentService(currentService !== 'ips' ? 'ips' : '') }}
                    />

                    <PrimaryButton
                        isDisabled={!currentService}
                        text={t('welcome.dark.buttonText')}
                        callback={() => {
                            if (!isOnline) {
                                console.log('No internet connection, welcomePageWithServices:start')   
                            }
                            if(currentService === 'betting')
                                navigate('/disclaimer')    
                            if(currentService === 'gaming')
                                navigate('/gaming')
                        }}
                        inverted={true}
                    />
                </div>
                <Footer isWelcome={true} />
            </div>
        </Container>
    )
}
