import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"

import Header from "./components/atoms/header/header"
import HomePage from "./pages/homePage"
import RegisterPage from "./pages/registerPage"

function Layout() {
  const location = useLocation()
  const hideHeaderOn = ["/register"]

  const shouldHideHeader = hideHeaderOn.includes(location.pathname)

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
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
