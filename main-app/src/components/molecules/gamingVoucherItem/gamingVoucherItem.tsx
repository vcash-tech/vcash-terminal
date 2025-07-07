import React from 'react'
import './_gamingVoucherItem.scss'
import { useTranslation } from 'react-i18next'
import usIcon from '@/assets/icons/usIcon.svg'
import ukIcon from '@/assets/icons/ukIcon.svg'
import croIcon from '@/assets/icons/croIcon.svg'
import background from '@/assets/images/background.png'
import { comingSoonGaming } from '@/assets/icons'

export interface GamingVoucherItemProps {
    title: string
    body: string
    image?: string
    price?: string
    isComing?: boolean
    flags?: string[]
}

const flagIcons: Record<string, string> = {
    us: usIcon,
    uk: ukIcon,
    cro: croIcon
}

const GamingVoucherItem: React.FC<GamingVoucherItemProps> = ({
    title,
    body,
    image,
    price,
    isComing,
    flags = ['us', 'uk', 'cro']
}) => {
    const { t } = useTranslation()
    return (
        <div
            className={`gaming-voucher-item${isComing ? ' coming' : ''}`}
            style={isComing ? { backgroundImage: `url(${background})` } : {}}>
            <div
                className={`gaming-voucher-item__content${isComing ? ' coming' : ''}`}>
                <h3>{t(title)}</h3>
                <p>{t(body)}</p>
            </div>
            {!isComing && image && (
                <img
                    src={image}
                    alt={t(title)}
                    className="gaming-voucher-item__image"
                />
            )}
            {isComing && (
                <span className="gaming-voucher-item__coming-badge">
                    <img src={comingSoonGaming} />
                </span>
            )}
            {!isComing && (
                <div className="gaming-voucher-item__bottom-bar">
                    <div className="gaming-voucher-item__flags">
                        {flags.map((flag) => (
                            <img key={flag} src={flagIcons[flag]} alt={flag} />
                        ))}
                    </div>
                    {price && (
                        <div
                            className="gaming-voucher-item__price"
                            style={
                                t(title) === 'XBOX Gift Cards'
                                    ? { color: '#1C7F16' }
                                    : {}
                            }>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: t(price)
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default GamingVoucherItem
