import './styles/app.scss'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import BettingPage from '@/pages/bettingPage'
import GamingPage from '@/pages/gamingPage'

import { KeyboardProvider } from './context/KeyboardContext'
import useInactivityRedirect from './helpers/inactivityRedirect'
import { NavigationProvider , useNavigationContext } from './hooks/useNavigationContext'
import { TranslationProvider } from './i18n/TranslationProvider'
import DigitalServicesPage from './pages/digitalSevicesPage'
import DisclaimerPage from './pages/disclaimerPage'
import HomePage from './pages/homePage'
import InsertCashPage from './pages/insertCashPage'
import PaymentMethodPage from './pages/paymentMethodPage'
import RegisterPage from './pages/registerPage'
import UnderMaintenacePage from './pages/UnderMaintenance'
import WelcomePage from './pages/welcomePage'
import WelcomeWithServicesPage from './pages/welcomeWithServicesPage'

function Layout() {
    const { startUrl } = useNavigationContext()

    useInactivityRedirect(startUrl ?? '/welcome')
    return (
        <Routes>
            <Route path="/welcome-with-services" element={<WelcomeWithServicesPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/gaming" element={<GamingPage />} />
            <Route path="/betting" element={<BettingPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route
                path="/digital-services"
                element={<DigitalServicesPage />}
            />
            <Route path="/payment-method" element={<PaymentMethodPage />} />
            <Route path="/buy-voucher-cash" element={<InsertCashPage />} />
            <Route
                path="/under-maintenance"
                element={<UnderMaintenacePage />}
            />
        </Routes>
    )
}

function App() {
    return (
        <TranslationProvider>
            <KeyboardProvider>
                <Router>
                    <NavigationProvider>
                        <Layout />
                    </NavigationProvider>
                </Router>
            </KeyboardProvider>
        </TranslationProvider>
    )
}

export default App
