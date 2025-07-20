import './_voucherItem.scss'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { ageDisclaimerWhite } from '@/assets/icons'


export interface VoucherItemProps {
    title: string
    subtitle: string
    image: string
    variant: 'bet' | 'gaming'
    onPress?: () => void
}

const VoucherItem: React.FC<VoucherItemProps> = ({
    title,
    subtitle,
    image,
    variant,
    onPress = () => {}
}) => {
    const { t } = useTranslation()
    return (
        <button
            onClick={onPress}
            className={`voucher-item voucher-item--${variant}`}>
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
