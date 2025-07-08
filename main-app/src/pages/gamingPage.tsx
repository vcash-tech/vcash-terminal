import { useNavigate } from 'react-router-dom'

import GamingVoucher from '@/components/templates/gamingVoucher/gamingVoucherTemplate'

export default function GamingPage() {
    const navigate = useNavigate()

    return <GamingVoucher navigate={navigate} />
}
