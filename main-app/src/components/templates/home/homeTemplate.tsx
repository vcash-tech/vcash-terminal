import { paymentsIcon } from '@/assets/icons'
import {
    bettingServices,
    digitalServices
} from '@/assets/images'
import Container from '@/components/atoms/container/container'
import HalfContainer from '@/components/atoms/container/halfContainer'
import HorizontalContainer from '@/components/atoms/container/horizontalContainer'
import HomeItem from '@/components/molecules/homeItem/homeItem'
import HorizontalItem from '@/components/molecules/horizontalItem/horizontalItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'

export default function HomeTemplate() {
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
                        />
                    </HalfContainer>
                    <HalfContainer style={{ display: 'block' }}>
                        <HomeItem
                            title="Digital Services"
                            image={digitalServices}
                            body="For gaming, streaming, E-SIMS, top-ups and other services."
                        />
                    </HalfContainer>
                </HorizontalContainer>
                <HorizontalItem
                    title="Bill Payments"
                    body="Quickly Scan your bill to pay via barcodes."
                    image={paymentsIcon}
                />
            </div>
            <Footer />
        </Container>
    )
}
