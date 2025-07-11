import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { ageDisclaimer } from '@/assets/icons'
import { qrCode } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import BettingVoucherItem from '@/components/molecules/bettingVoucherItem/bettingVoucherItem'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { bettingVoucherCards } from '@/data/mocks/bettingVoucher.mock'

export type BettingVoucherProps = {
    navigate: NavigateFunction
}

export default function BettingVoucher({ navigate }: BettingVoucherProps) {
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
                navigateBackUrl={'/digital-services'}
                navigationBackText={' '} //t('digitalServices.backToServices')}
            />
            <div 
                className={`betting-voucher`}>
                <h1>
                    {t('bettingVouchers.title')}{' '}
                    <img className="header-ico" src={ageDisclaimer} />
                </h1>
                <h2
                    dangerouslySetInnerHTML={{
                        __html: t('bettingVouchers.description')
                    }}
                />
                <div className={`betting-voucher__qr-box ${shouldNotify ? 'active-notification' : ''}`}>
                    <div className="betting-voucher__qr-image-wrapper">
                        <img src={qrCode} alt="QR Code" />
                    </div>
                    <div className="betting-voucher__qr-content">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t('bettingVouchers.qrInfo')
                            }}
                            className="betting-voucher__qr-title"
                        />

                        <p
                            className="betting-voucher__qr-desc"
                            style={{ whiteSpace: 'pre-line' }}
                            dangerouslySetInnerHTML={{
                                __html: t('bettingVouchers.qrInfo2')
                            }}
                        />
                    </div>
                </div>
                <div className="betting-voucher__cards-grid">
                    {bettingVoucherCards.map((card, idx) => (
                        <BettingVoucherItem key={idx} {...card} onPress={showNotification} />
                    ))}
                </div>
                <div className="gaming-voucher__primary-button">
                    <PrimaryButton
                        text={t('bettingVouchers.buttonText')}
                        onPress={() => navigate('/payment-method')}
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
