import { bettingServices, digitalServices } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import HalfContainer from '@/components/atoms/container/halfContainer'
import HorizontalContainer from '@/components/atoms/container/horizontalContainer'
import HomeItem from '@/components/molecules/homeItem/homeItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useNavigate } from 'react-router-dom'

export default function HomeTemplate() {
    const navigate = useNavigate()
    return (
        <Container isFullHeight={true} className="home-container">
            <Header navigateBackUrl="#" />
            <div className="home">
                <HorizontalContainer>
                    <HalfContainer style={{ display: 'block' }}>
                        <HomeItem
                            title="Betting Services"
                            image={bettingServices}
                            body="For Sports betting, Casino top-ups and others Betting Services."
                            handleClick={() => navigate('/disclaimer')}
                        />
                    </HalfContainer>
                    <HalfContainer style={{ display: 'block' }}>
                        <HomeItem
                            title="Digital Services"
                            image={digitalServices}
                            body="For gaming, streaming, E-SIMS, top-ups and other services."
                            handleClick={() => navigate('/digital-services')}
                        />
                    </HalfContainer>
                </HorizontalContainer>
                {/* <HorizontalItem
                    title="Bill Payments"
                    body="Quickly Scan your bill to pay via barcodes."
                    image={paymentsIcon}
                /> */}
            </div>
            <Footer />
        </Container>
    )
}
