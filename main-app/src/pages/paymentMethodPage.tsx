import { useNavigate } from 'react-router-dom'

import PaymentMethodTerminalTemplate from '@/components/templates/paymentMethodTerminal/paymentMethodTerminalTemplate'

export default function PaymentMethodPage() {
    const navigate = useNavigate()
    return <PaymentMethodTerminalTemplate navigate={navigate} />
}
