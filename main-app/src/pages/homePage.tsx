import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CashierSelect from '../components/cashierSelect'
import { AuthService } from '../services/authService'
import { TransactionService } from '../services/transactionService'
import { Auth } from '../types/common/httpRequest'
import HomeTemplate from '@/components/templates/home/homeTemplate'

function HomePage() {
    const [amount, setAmount] = useState<number | null>(null)
    const [printResult, setPrintResult] = useState('')
    const [hasCashierToken, setHasCashierToken] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)

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
