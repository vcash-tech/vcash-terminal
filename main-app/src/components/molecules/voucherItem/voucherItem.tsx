import './_voucherItem.scss'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { ageDisclaimerWhite, comingSoonOrange, uskoroOrange } from '@/assets/icons'
import i18n from '@/i18n/i18n'


export interface VoucherItemProps {
    title: string
    subtitle: string
    image: string
    variant: 'bet' | 'gaming'
    onPress?: () => void
    isCommingSoon?: boolean
}

const VoucherItem: React.FC<VoucherItemProps> = ({
    title,
    subtitle,
    image,
    variant,
    onPress = () => {},
    isCommingSoon = false
}) => {
    const { t } = useTranslation()
    return (
        <button
            onClick={onPress}
            disabled={isCommingSoon}
            className={`voucher-item voucher-item--${variant} ${isCommingSoon ? 'coming-soon' : ''}`}>
            {isCommingSoon && (
                <span className="coming-soon-badge">
                    <img src={i18n.language === 'en' ? comingSoonOrange : uskoroOrange} />
                </span>
            )}
            <div className="voucher-item__text">
                {variant === 'bet' && (
                    <img className='age-disclaimer-voucher' src={ageDisclaimerWhite} alt="Age Disclaimer" />
                )}
                <h3 className="voucher-item__title">{t(title)}</h3>
                <p className="voucher-item__subtitle">{t(subtitle)}</p>
            </div>
            <div className="voucher-item__image-wrapper">
                <img src={image} alt={title} className="voucher-item__image" />
            </div>
        </button>
    )
}

export default VoucherItem
