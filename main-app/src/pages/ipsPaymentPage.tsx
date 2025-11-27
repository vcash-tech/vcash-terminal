import { useNavigate } from 'react-router-dom'

import IpsPaymentTemplate from '@/components/templates/ipsPayment/ipsPaymentTemplate'

export default function IpsPaymentPage() {
    const navigate = useNavigate()
    return <IpsPaymentTemplate navigate={navigate} />
}
