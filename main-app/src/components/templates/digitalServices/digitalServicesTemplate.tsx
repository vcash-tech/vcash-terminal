import Container from '@/components/atoms/container/container'
import ServiceListItem from '@/components/molecules/serviceListItem/serviceListItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HorizontalList from '@/components/organisms/horizontalList/horizontalList'
import QrCodeModal from '@/components/organisms/qrCodeModal/qrCodeModal'
import { DigitalService } from '@/data/entities/digitalService'
import { useNavigate } from 'react-router-dom'

export type DigitalServicesTemplateProps = {
    gamingServices?: DigitalService[]
    streamingServices?: DigitalService[]
    topServices?: DigitalService[]
}

export default function DigitalServicesTemplate({
    gamingServices,
    streamingServices,
    topServices
}: DigitalServicesTemplateProps) {
    const navigate = useNavigate()
    return (
        <Container isFullHeight={true} style={{ gap: 0 }}>
            <Header navigateBackUrl="#" navigationBackText="Back to Services" />
            <QrCodeModal isOpen={true} onClose={() => navigate('/')}/>
            <div className="digital-services">
                {gamingServices && gamingServices?.length > 0 && (
                    <HorizontalList
                        title="Gaming Services"
                        list={gamingServices.map((service) => (
                            <ServiceListItem service={service} />
                        ))}
                    />
                )}
                {streamingServices && streamingServices.length > 0 && (
                    <HorizontalList
                        title="Streaming Services"
                        list={streamingServices?.map((service) => (
                            <ServiceListItem service={service} />
                        ))}
                    />
                )}
                {topServices && topServices?.length > 0 && (
                    <HorizontalList
                        title="Top-Up Services"
                        list={topServices?.map((service) => (
                            <ServiceListItem service={service} />
                        ))}
                    />
                )}
            </div>
            <Footer />
        </Container>
    )
}
