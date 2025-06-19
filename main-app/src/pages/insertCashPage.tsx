import { useNavigate } from 'react-router-dom'

import InsertCashTemplate from '@/components/templates/insertCash/insertCashTemplate'

export default function InsertCashPage() {
    const navigate = useNavigate()
    return <InsertCashTemplate navigate={navigate} />
}
