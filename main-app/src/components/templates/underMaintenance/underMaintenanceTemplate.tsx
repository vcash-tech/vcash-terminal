import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { logoWhite, marketplace, tickets } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HomeCards from '@/components/organisms/homeCards/homeCards'
import { useWindowSize } from '@/hooks/useWindowSize'

export default function UnderMaintenance() {
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
                className={`under-maintanance-content`}
                style={{ maxHeight: height }}>
                <div className="home-cards-container">
                    <HomeCards isAnimating={isAnimating} />
                </div>

                <div className="home-screen-title">
                    <div className="vcash-logo">
                        <img src={logoWhite} alt="" />
                    </div>
                    <h1> {t('underMaintenance.title')}</h1>
                    <p>{t('underMaintenance.text')}</p>
                    <div className='QR-code'>
                        <img src={marketplace} alt="QR Code" />
                    </div>
                </div>

                <div className="tickets-container">
                    <img src={tickets} alt="" className="tickets-image" />
                </div>
            </div>
            <Footer isWelcome={true} />
        </Container>
    )
}
