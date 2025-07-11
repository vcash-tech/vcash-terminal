import React from 'react'
import { useTranslation } from 'react-i18next'

import { comingSoonGaming } from '@/assets/icons'
import background from '@/assets/images/background.png'

export interface BettingVoucherItemProps {
    title: string
    body: string
    image?: string
    isComing?: boolean
    onPress?: () => void
}

const BettingVoucherItem: React.FC<BettingVoucherItemProps> = ({
    title,
    body,
    image,
    isComing,
    onPress
}) => {
    const { t } = useTranslation()
    return (
        <button
            className={`betting-voucher-item${isComing ? ' coming' : ''}`}
            style={isComing ? { backgroundImage: `url(${background})` } : {}}
            onClick={onPress}>
            <div
                className={`betting-voucher-item__content${isComing ? ' coming' : ''}`}>
                <h3>{t(title)}</h3>
                <p dangerouslySetInnerHTML={{ __html: t(body) }} />
            </div>
            {!isComing && image && (
                <img
                    src={image}
                    alt={t(title)}
                    className="betting-voucher-item__image"
                />
            )}
            {isComing && (
                <span className="betting-voucher-item__coming-badge">
                    <img src={comingSoonGaming} />
                </span>
            )}
        </button>
    )
}

export default BettingVoucherItem
