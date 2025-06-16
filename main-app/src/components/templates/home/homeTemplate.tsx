import Container from '@/components/atoms/container/container'
import HalfContainer from '@/components/atoms/container/halfContainer'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'

export default function HomeTemplate() {
    return (
        <Container isFullHeight={true}>
            <Header navigateBackUrl="#" navigationBackText="Back to Services" />
            <div className="home">
                <p>Test</p>
                <Container isHorizontal={true} maxWidth="80%">
                    <HalfContainer>
                        <p>Test</p>
                    </HalfContainer>
                    <HalfContainer>
                        <p>Test</p>
                    </HalfContainer>
                </Container>
            </div>
            <Footer />
        </Container>
    )
}