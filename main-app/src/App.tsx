import './styles/app.scss'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import BettingPage from '@/pages/bettingPage'
import GamingPage from '@/pages/gamingPage'

import { KeyboardProvider } from './context/KeyboardContext'
import useInactivityRedirect from './helpers/inactivityRedirect'
import { TranslationProvider } from './i18n/TranslationProvider'
import DigitalServicesPage from './pages/digitalSevicesPage'
import DisclaimerPage from './pages/disclaimerPage'
import HomePage from './pages/homePage'
import InsertCashPage from './pages/insertCashPage'
import PaymentMethodPage from './pages/paymentMethodPage'
import RegisterPage from './pages/registerPage'
import WelcomePage from './pages/welcomePage'

function Layout() {
    useInactivityRedirect('/welcome')
    return (
        <>
            <Routes>
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
            </Routes>
        </>
    )
}

function App() {
    return (
        <TranslationProvider>
            <KeyboardProvider>
                <Router>
                    <Layout />
                </Router>
            </KeyboardProvider>
        </TranslationProvider>
    )
}

export default App
