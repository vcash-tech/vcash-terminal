import { useLocation, useNavigate } from 'react-router-dom'

import InsertCashTemplate from '@/components/templates/insertCash/insertCashTemplate'

export default function InsertCashPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const prevState = location.state || {} // This is the state object passed from previous navigation
    let voucherType
    switch (prevState?.voucherType) {
        case 'betting':
            voucherType = '30'
            break
        case 'gaming':
            voucherType = '20'
            break
        default:
            voucherType = '20' // Default to 'gaming' if no valid type is provided
    }

    return <InsertCashTemplate navigate={navigate} selectedVoucherType={voucherType} />
}
