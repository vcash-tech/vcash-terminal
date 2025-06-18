import Footer from '../components/organisms/footer/footer'
import Header from '../components/organisms/header/header'
import Welcome from '../components/templates/welcome/welcomeTemplate'

export default function WelcomePage() {
    return (
        <div className="welcome-page">
            <Header />
            <Welcome />
            <Footer />
        </div>
    )
}
