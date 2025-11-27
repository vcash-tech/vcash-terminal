import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import IpsPaymentTemplate from '@/components/templates/ipsPayment/ipsPaymentTemplate'
import { verifyCashierAuth } from '@/utilities/sessionHelper'

export default function IpsPaymentPage() {
    const navigate = useNavigate()

    useEffect(() => {
        verifyCashierAuth(navigate)
    }, [navigate])

    return (
        <div className="ips-payment-page">
            <IpsPaymentTemplate navigate={navigate} />
        </div>
    )
}
