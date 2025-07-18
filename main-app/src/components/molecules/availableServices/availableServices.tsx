import React from 'react'
import Marquee from "react-fast-marquee"
import { useTranslation } from 'react-i18next'

export interface AvailableServicesProps {
    title: string
    images: string[]
}

const AvailableServices: React.FC<AvailableServicesProps> = ({
    title,
    images,
}) => {
    const { t } = useTranslation()
    return (
      <div className='availableServices'>
        <h3>{t(title)}:</h3>
        <Marquee >
          {images.map((image) => (
            <div key={image} className='marquee-item'>
              <img src={image} alt={t(title)} />
            </div>
          ))}
        </Marquee>
      </div>
    )
}

export default AvailableServices
