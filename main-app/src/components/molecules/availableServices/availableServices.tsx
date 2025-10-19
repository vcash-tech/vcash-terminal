import React from 'react'
import Marquee from 'react-fast-marquee'
import { useTranslation } from 'react-i18next'

export interface AvailableServicesProps {
    title: string
    images: string[]
}

const AvailableServices: React.FC<AvailableServicesProps> = ({
    title,
    images
}) => {
    const { t } = useTranslation()
    return (
        <div className="availableServices">
            <h3 dangerouslySetInnerHTML={{ __html: t(title) }} />
            <Marquee>
                {images.map((image, idx) => (
                    <div key={image + idx} className="marquee-item">
                        <img src={image} alt={t(title)} />
                    </div>
                ))}
            </Marquee>
        </div>
    )
}

export default AvailableServices
