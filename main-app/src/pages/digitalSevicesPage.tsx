import { useNavigate } from 'react-router-dom'

import DigitalServicesTemplate from '@/components/templates/digitalServices/digitalServicesTemplate'

export default function DigitalServicesPage() {
    const navigate = useNavigate()
    return <DigitalServicesTemplate navigate={navigate} />
}
