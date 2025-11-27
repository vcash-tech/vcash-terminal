import React from 'react'
import { useTranslation } from 'react-i18next'

import { ageDisclaimerWhiteFilled } from '@/assets/icons'
import { pointingHand } from '@/assets/images'

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
            <div className="services-grid">
                {images.slice(0, 6).map((image, idx) => (
                    <div
                        key={idx}
                        className={`grid-item ${image.isComingSoon ? 'coming-soon' : ''}`}>
                        <img src={image.src} alt={t(title)} />
                    </div>
                ))}
            </div>
            <div className="action-container">
                <div
                    className={`action ${isSelected ? 'selected' : ''} ${type}`}>
                    {actionText}
                </div>
            </div>
        </button>
    )
}

export default ServicesDark
