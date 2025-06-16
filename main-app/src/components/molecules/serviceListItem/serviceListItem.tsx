import DigitalService from '@/data/entities/digitalService'

export default function ServiceListItem({
    service,
    size = { width: 230, height: 230 }
}: {
    size?: { width: number; height: number }
    service: DigitalService
}) {
    return (
        <div
            className="service-list-item"
            style={{
                minWidth: `${size?.width}px`,
                minHeight: `${size?.height}px`
            }}>
            <img src={service.image} alt={service.name} />
            <p className={'title'}>{service.name}</p>
            <p className={'price'}>{service.price}</p>
        </div>
    )
}
