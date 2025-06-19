import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'

import { AuthService } from '@/services/authService'
import { POSService } from '@/services/posService'
import { Auth } from '@/types/common/httpRequest'

interface Props {
    setHasCashierToken: (hasToken: boolean) => void
}

export default function CashierSelect({ setHasCashierToken }: Props) {
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        const handleUnlock = async (username: string, pin: string) => {
            try {
                const response = await POSService.unlockDevice({
                    userName: username,
                    pin
                })
                AuthService.SetToken(Auth.Cashier, response.accessToken)
                // Handle successful unlock, e.g., redirect or show success message
                console.log('Device unlocked successfully')
                setHasCashierToken(true)
            } catch (error) {
                console.error('Error unlocking device:', error)
                // Handle error, e.g., show error message
            }
        }

        const fetchCashiers = async () => {
            setLoader(true)
            try {
                const cashiersResponse = await POSService.getCashiersPOS()

                const firstWithFixedPin = cashiersResponse.cashiers.find(
                    (cashier) => !!cashier.fixedPin
                )

                await handleUnlock(
                    firstWithFixedPin?.userName || '',
                    firstWithFixedPin?.fixedPin || ''
                )
            } catch (error) {
                console.error('Error fetching cashiers:', error)
            }
            setLoader(false)
        }
        fetchCashiers()
    }, [])

    return <div>{loader && <CircularProgress />}</div>
}
