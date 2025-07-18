import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigateFunction } from 'react-router-dom'

import { ageDisclaimer } from '@/assets/icons'
import {
    betting_balkanBet,
    betting_meridian,
    betting_merkurXtip,
    betting_soccerBet
} from '@/assets/images'
import Container from '@/components/atoms/container/container'
import HelpButton from '@/components/atoms/helpButton/helpButton'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import AvailableServices from '@/components/molecules/availableServices/availableServices'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import HowTo from '@/components/organisms/how-to/how-to'

export type BettingVoucherProps = {
    navigate: NavigateFunction
}

export default function BettingVoucher({ navigate }: BettingVoucherProps) {
    const { t } = useTranslation()
    return (
        <Container isFullHeight={true}>
            <Header
                navigateBackUrl={'/digital-services'}
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
                <AvailableServices
                    title={t('bettingVouchers.availableServices')}
                    images={[
                        betting_balkanBet,
                        betting_soccerBet,
                        betting_merkurXtip,
                        betting_meridian
                    ]}
                />
                <HowTo isModal={false} isBetting={true} />
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
