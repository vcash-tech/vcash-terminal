import React from 'react'
import Marquee from "react-fast-marquee"
import { useTranslation } from 'react-i18next'

import { ageDisclaimerPng, checkBoxNotSelected, checkBoxSelected } from '@/assets/icons'
import { uskoroGreenLarge, uskoroGreenSmall } from '@/assets/images'
import i18n from '@/i18n/i18n'

export interface serviceDarkProps {
    title: string
    subtitle: string
    isSelected: boolean
    isCommingSoon: boolean
    hasAgeDisclamer: boolean
    images: serviceImage[],
    type: string,
    onClick: () => void
}

export interface serviceImage {
  src: string,
  isCommingSoon: boolean
}

const ServicesDark: React.FC<serviceDarkProps> = ({
    title,
    subtitle,
    type,
    isSelected = false,
    isCommingSoon = false,
    hasAgeDisclamer = false,
    images,
    onClick
}) => {
    const { t } = useTranslation()

    return (
      <button disabled={!!isCommingSoon} className={`service-dark ${type} ${isSelected ? 'selected' : ''}`} onClick={onClick}>
        {!isCommingSoon && <img className="checkbox-selected" src={isSelected ? checkBoxSelected : checkBoxNotSelected } alt="select" />}
        {isCommingSoon && (<img className='coming-soon-large' src={i18n.language === 'en' ? uskoroGreenLarge : uskoroGreenLarge } />)}
        <h3>
          {t(title)}
          {hasAgeDisclamer && (
            <img className="age-disclaimer" src={ageDisclaimerPng} alt="Age disclaimer" />
          )}
        </h3>
        <p dangerouslySetInnerHTML={{ __html: t(subtitle)}} />
        <Marquee >
          {images.map((image, idx) => (
            <div key={idx} className={`marquee-item ${image.isCommingSoon ? 'coming-soon' : ''}`}>
              {image.isCommingSoon && (<img className='coming-soon-banner' src={i18n.language === 'en' ? uskoroGreenSmall : uskoroGreenSmall } />)}
              <img src={image.src} alt={t(title)} />
            </div>
          ))}
        </Marquee>
      </button>
    )
}

export default ServicesDark
