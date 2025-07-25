import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { marketplaceQR } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import GamingVoucherItem from '@/components/molecules/gamingVoucherItem/gamingVoucherItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { gamingVoucherCards } from '@/data/mocks/gamingVoucher.mock'

export type GamingVoucherProps = {
    navigate: NavigateFunction
}
export default function GamingVoucher({ navigate }: GamingVoucherProps) {
    const { t } = useTranslation()
    const [shouldNotify, setShouldNotify] = useState(false)

    const showNotification = () => {
        if (shouldNotify === true) {
            return
        }
        setShouldNotify(true)
        setTimeout(() => {
            setShouldNotify(false)
        }, 5000)
    }

    return (
        <Container isFullHeight={true}>
            <Header
                navigationBackText={' '}
                navigateBackUrl={'/digital-services'}
            />
            <div className="gaming-voucher">
                <h1>{t('gamingVouchers.title')}</h1>
                <h2
                    dangerouslySetInnerHTML={{
                        __html: t('gamingVouchers.description')
                    }}
                />
                <div
                    className={`gaming-voucher__qr-box ${shouldNotify ? 'active-notification' : ''}`}>
                    <div className="gaming-voucher__qr-image-wrapper">
                        <img src={marketplaceQR} alt="QR Code" />
                    </div>
                    <div className="gaming-voucher__qr-content">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t('gamingVouchers.qrInfo')
                            }}
                            className="gaming-voucher__qr-title"
                        />

                        <p
                            className="gaming-voucher__qr-desc"
                            style={{ whiteSpace: 'pre-line' }}
                            dangerouslySetInnerHTML={{
                                __html: t('gamingVouchers.qrInfo2')
                            }}
                        />
                    </div>
                </div>
                <div className="gaming-voucher__cards-grid">
                    {gamingVoucherCards.map((card, idx) => (
                        <GamingVoucherItem
                            key={idx}
                            {...card}
                            onPress={showNotification}
                        />
                    ))}
                </div>
                <div className="gaming-voucher__primary-button">
                    <PrimaryButton
                        text={t('gamingVouchers.buttonText')}
                        onPress={() => navigate('/payment-method')}
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
