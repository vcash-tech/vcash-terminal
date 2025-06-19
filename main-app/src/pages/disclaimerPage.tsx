import { useNavigate } from 'react-router-dom'

import AgeDisclaimerTemplate from '@/components/templates/ageDisclaimer/ageDisclaimerTemplate'

export default function DisclaimerPage() {
    const navigate = useNavigate()
    return <AgeDisclaimerTemplate navigate={navigate} />
}
