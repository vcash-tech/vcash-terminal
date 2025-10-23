import React from 'react'
import Marquee from 'react-fast-marquee'
import { useTranslation } from 'react-i18next'

import { ageDisclaimerWhiteFilled } from '@/assets/icons'
import {
    comingSoonSmall,
    pointingHand,
    uskoroGreenSmall
} from '@/assets/images'
import i18n from '@/i18n/i18n'

export interface serviceDarkProps {
    title: string
    subtitle: string
    isSelected: boolean
    isComingSoon: boolean
    hasAgeDisclaimer: boolean
    images: serviceImage[]
    type: string
    onClick: () => void
    actionText: string
}

export interface serviceImage {
    src: string
    isComingSoon: boolean
}

const ServicesDark: React.FC<serviceDarkProps> = ({
    title,
    subtitle,
    type,
    isSelected = false,
    isComingSoon = false,
    hasAgeDisclaimer = false,
    images,
    onClick,
    actionText
}) => {
    const { t } = useTranslation()

    return (
        <button
            disabled={!!isComingSoon}
            className={`service-dark ${type} ${isSelected ? 'selected' : ''}`}
            onClick={onClick}>
            {!isComingSoon && (
                <img
                    className="checkbox-selected"
                    src={pointingHand}
                    alt="select"
                />
            )}
            <h3>
                {t(title)}
                {hasAgeDisclaimer && (
                    <img
                        className="age-disclaimer"
                        src={ageDisclaimerWhiteFilled}
                        alt="Age disclaimer"
                    />
                )}
            </h3>
            <p dangerouslySetInnerHTML={{ __html: t(subtitle) }} />
            <Marquee>
                {images.map((image, idx) => (
                    <div
                        key={idx}
                        className={`marquee-item ${image.isComingSoon ? 'coming-soon' : ''}`}>
                        {image.isComingSoon && (
                            <img
                                className="coming-soon-banner"
                                src={
                                    i18n.language === 'en'
                                        ? comingSoonSmall
                                        : uskoroGreenSmall
                                }
                            />
                        )}
                        <img src={image.src} alt={t(title)} />
                    </div>
                ))}
            </Marquee>
            <div className="action-container">
                <div className={`action ${isSelected ? 'selected' : ''}`}>
                    {actionText}
                </div>
            </div>
        </button>
    )
}

export default ServicesDark
