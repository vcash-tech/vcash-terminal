import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import ServiceTemplate from '@/components/templates/services/serviceTemplate'
import { POSService } from '@/services/posService'

import { AuthService } from '../services/authService'
import { Auth } from '../types/common/httpRequest'

function HomePage() {
    // const [loader, setLoader] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchCashiers = async () => {
            try {
                const cashiersResponse = await POSService.getCashiersPOS()

                const firstWithFixedPin = cashiersResponse?.cashiers?.find(
                    (cashier) => !!cashier.fixedPin
                )

                await handleUnlock(
                    firstWithFixedPin?.userName || '',
                    firstWithFixedPin?.fixedPin || ''
                )
            } catch (error) {
                console.error('Error fetching cashiers:', error)
            }
        }

        if (!AuthService.GetToken(Auth.Cashier)) {
            fetchCashiers()
        }
    }, [])

    const handleUnlock = async (username: string, pin: string) => {
        try {
            const response = await POSService.unlockDevice({
                userName: username,
                pin
            })
            AuthService.SetToken(Auth.Cashier, response.accessToken)
            // Handle successful unlock, e.g., redirect or show success message
            console.log('Device unlocked successfully')
        } catch (error) {
            console.error('Error unlocking device:', error)
            // Handle error, e.g., show error message
        }
    }

    useEffect(() => {
        const token = AuthService.GetToken(Auth.POS)
        if (!token) {
            navigate('/register')
        }
    }, [navigate])

    return <ServiceTemplate navigate={navigate} />
}

export default HomePage
