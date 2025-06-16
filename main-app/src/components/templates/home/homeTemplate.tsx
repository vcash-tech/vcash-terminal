import { bettingServices, digitalServices } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import HalfContainer from '@/components/atoms/container/halfContainer'
import HorizontalContainer from '@/components/atoms/container/HorizontalContainer'
import HomeItem from '@/components/molecules/homeItem/homeItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'

export default function HomeTemplate() {
    return (
        <Container isFullHeight={true}>
            <Header navigateBackUrl="#" />
            <div className="home">
                <HorizontalContainer 
                    
                    >
                    <HalfContainer style={{display: 'block'}}>
                        <HomeItem
                            title="Betting Services"
                            image={bettingServices}
                            body="For Sports betting, Casino top-ups and others Betting Services."
                        />
                    </HalfContainer>
                    <HalfContainer style={{display: 'block'}}>
                        <HomeItem
                            title="Digital Services"
                            image={digitalServices}
                            body="For gaming, streaming, E-SIMS, top-ups and other services."
                        />
                    </HalfContainer>
                </HorizontalContainer>
                {/* <HomeItem
                    title="Betting Services"
                    image={bettingServices}
                    body="For Sports betting, Casino top-ups and others Betting Services."
                /> */}
            </div>
            <Footer />
        </Container>
    )
}
