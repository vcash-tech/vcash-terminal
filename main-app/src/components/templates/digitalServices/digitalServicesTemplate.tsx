import Container from '@/components/atoms/container/container'
import ServiceListItem from '@/components/molecules/serviceListItem/serviceListItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HorizontalList from '@/components/organisms/horizontalList/horizontalList'
import { DigitalService } from '@/data/entities/digitalService'

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
    return (
        <Container isFullHeight={true} style={{ gap: 0 }}>
            <Header navigateBackUrl="#" navigationBackText="Back to Services" />
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
