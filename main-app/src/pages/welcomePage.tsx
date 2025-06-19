import { useNavigate } from 'react-router-dom'

import Footer from '../components/organisms/footer/footer'
import Header from '../components/organisms/header/header'
import Welcome from '../components/templates/welcome/welcomeTemplate'

export default function WelcomePage() {
    const navigate = useNavigate()
    return (
        <div className="welcome-page">
            <Header />
            <Welcome navigate={navigate} />
            <Footer />
        </div>
    )
}
