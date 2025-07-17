import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { gaming_josServisaUskoro, gaming_playstation, gaming_steam, gaming_xbox } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AvailableServices from '@/components/molecules/availableServices/availableServices'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'

export type GamingVoucherProps = {
    navigate: NavigateFunction
}
export default function GamingVoucher({ navigate }: GamingVoucherProps) {
    const { t } = useTranslation()

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
                <AvailableServices title={t('gamingVouchers.availableServices')} images={[gaming_xbox, gaming_steam, gaming_playstation, gaming_josServisaUskoro]} />
                
                
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
