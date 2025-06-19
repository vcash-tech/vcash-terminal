import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import HomeTemplate from '@/components/templates/home/homeTemplate'
import { AuthService } from '@/services/authService'
import { Auth } from '@/types/common/httpRequest'

function HomePage() {
    // TODO: Fix unused state variables
    const [_amount, _setAmount] = useState<number | null>(null)
    const [_printResult, _setPrintResult] = useState('')
    const [_hasCashierToken, setHasCashierToken] = useState<boolean>(false)
    const [_loader, _setLoader] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        const token = AuthService.GetToken(Auth.POS)
        if (!token) {
            navigate('/register')
        }
    }, [navigate])

    useEffect(() => {
        const token = AuthService.GetToken(Auth.Cashier)
        setHasCashierToken(!!token)
    }, [navigate])

    return <HomeTemplate />
}

export default HomePage
