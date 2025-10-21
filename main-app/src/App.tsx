import './styles/app.scss'

import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import NoInternetModal from '@/components/organisms/noInternetModal/noInternetModal'
import SessionTimeout from '@/components/organisms/sessionTimeoutModal/sessionTimeout'
import { useNavigationContext } from '@/hooks/useNavigationHook'
import BettingPage from '@/pages/bettingPage'
import GamingPage from '@/pages/gamingPage'
import { OrderProvider } from '@/providers/orderProvider'

import PaymentInProgress from './components/templates/paymentInProgress/paymentInProgress'
import { KeyboardProvider } from './context/KeyboardContext'
import useInactivityRedirect from './helpers/inactivityRedirect'
import { InternetConnectionProvider } from './hooks'
import { NavigationProvider } from './hooks/useNavigationContext'
import { TranslationProvider } from './i18n/TranslationProvider'
import DisclaimerPage from './pages/disclaimerPage'
import HomePage from './pages/homePage'
import InsertCashPage from './pages/insertCashPage'
import PaymentMethodPage from './pages/paymentMethodPage'
import RegisterPage from './pages/registerPage'
import UnderMaintenacePage from './pages/UnderMaintenance'
import WelcomeWithServicesPage from './pages/welcomeWithServicesPage'

function Layout() {
    const { startUrl } = useNavigationContext()
    useInactivityRedirect(startUrl ?? '/welcome-with-services')

    return (
        <Routes>
            <Route
                path="/welcome-with-services"
                element={<WelcomeWithServicesPage />}
            />
            <Route path="/welcome" element={<WelcomeWithServicesPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/gaming" element={<GamingPage />} />
            <Route path="/betting" element={<BettingPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            {/* <Route path="/digital-services" element={<DigitalServicesPage />} /> */}
            <Route path="/payment-method" element={<PaymentMethodPage />} />
            <Route path="/buy-voucher-cash" element={<InsertCashPage />} />
            <Route
                path="/under-maintenance"
                element={<UnderMaintenacePage />}
            />
            <Route
                path="/payment-in-progress"
                element={<PaymentInProgress />}
            />
        </Routes>
    )
}

function App() {
    // Disable right-click context menu globally

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            return false
        }

        // Add event listener to disable right-click
        document.addEventListener('contextmenu', handleContextMenu)

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [])

    return (
        <InternetConnectionProvider>
            <OrderProvider>
                <TranslationProvider>
                    <KeyboardProvider>
                        <Router>
                            <NavigationProvider>
                                <Layout />
                                <NoInternetModal />
                                <SessionTimeout />
                            </NavigationProvider>
                        </Router>
                    </KeyboardProvider>
                </TranslationProvider>
            </OrderProvider>
        </InternetConnectionProvider>
    )
}

export default App
