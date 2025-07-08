import { useNavigate } from 'react-router-dom'

import ServiceTemplate from '@/components/templates/services/serviceTemplate'

export default function DigitalServicesPage() {
    const navigate = useNavigate()
    return <ServiceTemplate navigate={navigate} />
}
