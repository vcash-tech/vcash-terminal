import { NavigateFunction } from 'react-router-dom'

import { paymentsIcon } from '@/assets/icons'
import { bettingServices, digitalServices } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import HalfContainer from '@/components/atoms/container/halfContainer'
import HorizontalContainer from '@/components/atoms/container/horizontalContainer'
import HomeItem from '@/components/molecules/homeItem/homeItem'
import HorizontalItem from '@/components/molecules/horizontalItem/horizontalItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

export default function HomeTemplate({
    navigate,
    isLoading
}: {
    navigate: NavigateFunction
    isLoading?: boolean
}) {
    const { t } = useTranslate()
    return (
        <Container isFullHeight={true} className="home-container">
            <Header />
            <div className="home">
                <HorizontalContainer>
                    <HalfContainer style={{ display: 'block' }}>
                        {isLoading ? (
                            <div className="home-item loading-container"></div>
                        ) : (
                            <HomeItem
                                title={t('home.bettingServices.title')}
                                image={bettingServices}
                                body={t('home.bettingServices.body')}
                                handleClick={() => navigate('/disclaimer')}
                            />
                        )}
                    </HalfContainer>
                    <HalfContainer style={{ display: 'block' }}>
                        {isLoading ? (
                            <div className="home-item loading-container"></div>
                        ) : (    <HomeItem
                            title={t('home.digitalServices.title')}
                            image={digitalServices}
                            body={t('home.digitalServices.body')}
                            handleClick={() => navigate('/digital-services')}
                            isDisabled={true}
                        />)}
                    </HalfContainer>
                </HorizontalContainer>
                {isLoading ? (
                    <div className="horizontal-item loading-container"></div>
                ) : (
                <HorizontalItem
                    title={t('home.billPayments.title')}
                    body={t('home.billPayments.body')}
                    image={paymentsIcon}
                    isDisabled={true}
                />)}
            </div>
            <Footer />
        </Container>
    )
}
