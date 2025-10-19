import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import {
    gaming_playstation,
    gaming_steam,
    gaming_xbox,
    vcashMarketQR,
    welcome_gaming_netflix,
    welcome_gaming_roblox
} from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AvailableServicesVertical from '@/components/molecules/availableServicesVertical/availableServicesVertical'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HowTo from '@/components/organisms/how-to/how-to'

export type GamingVoucherProps = {
    navigate: NavigateFunction
}
export default function GamingVoucher({ navigate }: GamingVoucherProps) {
    const { t } = useTranslation()
    return (
        <Container isFullHeight={true}>
            <Header navigationBackText={' '} navigateBackUrl={'/welcome'} />
            <div className="gaming-voucher">
                <h1>{t('gamingVouchers.title')}</h1>
                {/* <h2
                    dangerouslySetInnerHTML={{
                        __html: t('gamingVouchers.description')
                    }}
                /> */}
                <HowTo isModal={false} />
                <h2 className="inform-header">
                    {t('gamingVouchers.informText')}
                </h2>
                <div className="gaming-info-section">
                    <div className="gaming-info-scan">
                        <h3>{t('gamingVouchers.scanInfo.title')}</h3>
                        <img
                            src={vcashMarketQR}
                            alt="qr code with a url for the offer"
                        />
                        <p>{t('gamingVouchers.scanInfo.footer')}</p>
                    </div>
                    <div className="available-services-vertical">
                        <AvailableServicesVertical
                            items={[
                                {
                                    image: gaming_playstation,
                                    backgroundColor: '#D4DFED',
                                    serviceName: 'PlayStation',
                                    region: 'US/UK/CRO',
                                    priceRangeCurrency: 'USD/GBP/EUR',
                                    priceRangeText: '10 - 100'
                                },
                                {
                                    image: gaming_xbox,
                                    backgroundColor: '#DEE8DB',
                                    serviceName: 'XBOX',
                                    region: 'Europe',
                                    priceRangeCurrency: 'EUR',
                                    priceRangeText: '10 - 50'
                                },
                                {
                                    image: gaming_steam,
                                    backgroundColor: '#D4D4D4',
                                    serviceName: 'Steam',
                                    region: 'Europe',
                                    priceRangeCurrency: 'EUR',
                                    priceRangeText: '10 - 20'
                                },
                                {
                                    image: welcome_gaming_roblox,
                                    backgroundColor: '#DCE3FF',
                                    serviceName: 'Roblox',
                                    region: 'Europe',
                                    priceRangeCurrency: 'EUR',
                                    priceRangeText: '10 - 50'
                                },
                                {
                                    image: welcome_gaming_netflix,
                                    backgroundColor: '#F4D6DD',
                                    serviceName: 'Netflix',
                                    region: 'Europe',
                                    priceRangeCurrency: 'EUR',
                                    priceRangeText: '25 - 50'
                                }
                            ]}
                        />
                    </div>
                </div>

                <div className="gaming-voucher__primary-button">
                    <PrimaryButton
                        text={t('gamingVouchers.buttonText')}
                        onPress={() =>
                            navigate('/payment-method', {
                                state: { voucherType: 'gaming' }
                            })
                        }
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
