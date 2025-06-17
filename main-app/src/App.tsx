import './styles/app.scss'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { KeyboardProvider } from './context/KeyboardContext'
import { TranslationProvider } from './i18n/TranslationProvider'
import HomePage from './pages/homePage'
import RegisterPage from './pages/registerPage'
import WelcomePage from './pages/welcomePage/welcomePage'

function Layout() {
    return (
        <>
            {/*{!shouldHideHeader && <Header />}*/}
            <Routes>
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
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
