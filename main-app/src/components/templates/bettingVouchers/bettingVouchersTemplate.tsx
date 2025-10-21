import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { ageDisclaimer } from '@/assets/icons'
import {
    betting_balkanBet,
    //betting_maxBetComingSoon,
    betting_maxBet,
    betting_meridian,
    betting_merkurXtip,
    //betting_meridianBetComingSoon,
    //betting_meridianBetUskoro,
    //betting_merkurXtipComingSoon,
    //betting_merkurXtipUskoro,
    betting_soccerBet,
    betting_VolcanoComingSoon
} from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AvailableServices from '@/components/molecules/availableServices/availableServices'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HowTo from '@/components/organisms/how-to/how-to'
//import i18n from '@/i18n/i18n'

export type BettingVoucherProps = {
    navigate: NavigateFunction
}

export default function BettingVoucher({ navigate }: BettingVoucherProps) {
    const { t } = useTranslation()

    const bettingImages = [
        betting_balkanBet,
        betting_soccerBet,
        betting_merkurXtip,
        betting_maxBet,
        betting_meridian,
        betting_VolcanoComingSoon,
        betting_balkanBet,
        betting_soccerBet,
        betting_merkurXtip,
        betting_maxBet,
        betting_meridian,
        betting_VolcanoComingSoon
    ]

    // if (i18n.language === 'en') {
    //     bettingImages.push(betting_maxBetComingSoon, betting_meridianBetComingSoon, betting_merkurXtipComingSoon)
    // } else {
    //     bettingImages.push(betting_maxBetUskoro, betting_meridianBetUskoro, betting_merkurXtipUskoro)
    // }

    return (
        <Container isFullHeight={true}>
            <Header
                navigateBackUrl={'/welcome'}
                navigationBackText={' '} //t('digitalServices.backToServices')}
            />
            <div className={`betting-voucher`}>
                <h1>
                    {t('bettingVouchers.title')}{' '}
                    <img className="header-ico" src={ageDisclaimer} />
                </h1>
                <h2
                    dangerouslySetInnerHTML={{
                        __html: t('bettingVouchers.description')
                    }}
                />
                <HowTo isModal={false} isBetting={true} />
                <AvailableServices
                    title={t('bettingVouchers.availableServices')}
                    images={bettingImages}
                />
                <div className="gaming-voucher__primary-button">
                    <PrimaryButton
                        text={t('bettingVouchers.buttonText')}
                        onPress={() =>
                            navigate('/payment-method', {
                                state: { voucherType: 'betting' }
                            })
                        }
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
