import { useNavigate } from 'react-router-dom'

import BettingVoucher from '@/components/templates/bettingVouchers/bettingVouchersTemplate'

export default function BettingPage() {
    const navigate = useNavigate()

    return <BettingVoucher navigate={navigate} />
}