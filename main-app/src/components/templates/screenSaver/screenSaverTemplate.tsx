import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { logoWhite, tickets } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HomeCards from '@/components/organisms/homeCards/homeCards'
import { useWindowSize } from '@/hooks/useWindowSize'

export default function ScreenSaverTemplate({
    navigate,
    isFullScreen
}: {
    navigate: NavigateFunction
    isFullScreen: boolean
}) {
    const [isFullSize, setIsFullSize] = useState(isFullScreen)
    const [isAnimating, setIsAnimating] = useState(false)
    const { height } = useWindowSize()
    const { t } = useTranslation()

    // Handle animation state when transitioning between modes
    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false)
            }, 500) // Match this with the CSS transition duration
            return () => clearTimeout(timer)
        }
    }, [isAnimating])

    return (
        <Container style={{ gap: 0 }} isFullHeight={true}>
            <Header />
            <div
                className={`screen-saver-content ${isFullSize ? 'full-size' : ''}`}
                style={{ maxHeight: height }}>
                {/* {isFullSize && (
                    <div className="vcash-logo fs-logo">
                        <img src={logoWhite} alt="" />
                    </div>
                )} */}
                <div className="home-cards-container">
                    <HomeCards
                        isFullScreen={isFullSize}
                        onTap={() => {
                            setIsAnimating(true)
                            setIsFullSize(!isFullSize)
                        }}
                        isAnimating={isAnimating}
                    />
                </div>

                {!isFullSize && (
                    <div className="home-screen-title">
                        <div className="vcash-logo">
                            <img src={logoWhite} alt="" />
                        </div>
                        <h1> {t('home.title')}</h1>
                        <p>{t('home.body')}</p>
                        <PrimaryButton
                            text={t('home.buttonText')}
                            callback={() => navigate('/services')}
                            inverted={true}
                        />
                    </div>
                )}
                <div className="tickets-container">
                    <img src={tickets} alt="" className="tickets-image" />
                </div>

                <button
                    className={`switch-screen-btn ${isFullSize ? 'full-screen-btn' : ''}`}
                    onClick={() => {
                        setIsAnimating(true)
                        setIsFullSize(!isFullSize)
                    }}
                />
            </div>
            <Footer isWelcome={true} />
        </Container>
    )
}
