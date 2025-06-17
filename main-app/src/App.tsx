import './styles/app.scss'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

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
        <Router>
            <Layout />
        </Router>
    )
}

export default App
