import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { logoWhite, tickets } from '@/assets/images'
// import { logoWhite, tickets } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HomeCards from '@/components/organisms/homeCards/homeCards'
import { useWindowSize } from '@/hooks/useWindowSize'
// import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
// import Footer from '@/components/organisms/footer/footer'
// import Header from '@/components/organisms/header/header'
// import HomeCards from '@/components/organisms/homeCards/homeCards'

export default function Welcome({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const [isAnimating, setIsAnimating] = useState(false)
    const { height } = useWindowSize()
    const { t } = useTranslation()

    // Handle animation state when transitioning between modes
    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false)
            }, 750) // Match this with the CSS transition duration
            return () => clearTimeout(timer)
        }
    }, [isAnimating])

    return (
        <Container style={{ gap: 0 }} isFullHeight={true}>
            <Header isWelcome={true} />
            <div
                className={`screen-saver-content`}
                style={{ maxHeight: height }}>
                <div className="home-cards-container">
                    <HomeCards
                        isAnimating={isAnimating}
                    />
                </div>

                <div className="home-screen-title">
                    <div className="vcash-logo">
                        <img src={logoWhite} alt="" />
                    </div>
                    <h1> {t('home.welcome.title')}</h1>
                    <p>{t('home.welcome.text')}</p>
                    <PrimaryButton
                        text={t('home.welcome.getStarted')}
                        callback={() => navigate('/digital-services')}
                        inverted={true}
                    />
                </div>

                <div className="tickets-container">
                    <img src={tickets} alt="" className="tickets-image" />
                </div>
            </div>
            <Footer isWelcome={true} />
        </Container>
    )
}
