import './styles/app.scss'

import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation
} from 'react-router-dom'

import Header from './components/organisms/header/header'
import HomePage from './pages/homePage'
import RegisterPage from './pages/registerPage'
import WelcomePage from './pages/welcomePage/welcomePage'

function Layout() {
    const location = useLocation()
    const hideHeaderOn = ['/welcome']

    const shouldHideHeader = hideHeaderOn.includes(location.pathname)

    return (
        <>
            {!shouldHideHeader && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/welcome" element={<WelcomePage />} />
            </Routes>
        </>
    )
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    )
}

export default App
