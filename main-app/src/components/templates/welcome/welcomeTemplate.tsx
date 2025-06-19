import { NavigateFunction } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import WelcomeScreen from '@/components/organisms/welcomeScreen/welcomeScreen'

export default function Welcome({ navigate }: { navigate: NavigateFunction }) {
    return (
        <Container style={{ gap: 0 }} isFullHeight={true}>
            <Header />
            <div className="welcome">
                <WelcomeScreen navigate={navigate} />
            </div>
            <Footer />
        </Container>
    )
}
