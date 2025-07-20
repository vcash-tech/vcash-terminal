import { NavigateFunction } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

import {
    ageDisclaimerWhite,
    bettingWarning,
    hospitalLogo,
    redWarningIcon,
    serbiaLogo
} from '../../../assets/icons'

export default function AgeDisclaimerTemplate({
    navigate
}: {
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()

    return (
        <Container isFullHeight={true}>
            <Header
                navigateBackUrl="/digital-services"
                navigationBackText={' '}
            />
            <div className="age-disclaimer-wrapper">
                <div className="age-disclaimer">
                    <div className="warning">
                        <img src={ageDisclaimerWhite} width={95} height={95} />
                        <p>{t('ageDisclaimer.warning')}</p>
                    </div>
                    <div className="betting-warning">
                        <img src={bettingWarning} width={95} height={95} />
                        <ul>
                            <li>{t('ageDisclaimer.bettingWarning1')}</li>
                            <li>{t('ageDisclaimer.bettingWarning2')}</li>
                            <li>{t('ageDisclaimer.bettingWarning3')}</li>
                        </ul>
                    </div>
                    <div className="logos">
                        <img src={hospitalLogo} height={50} width={50} />
                        <img src={serbiaLogo} height={50} width={50} />
                    </div>
                    <div className="hospital-info">
                        <p className="uppercase">{t('ageDisclaimer.hospital-name')}</p>
                        <p className="uppercase">{t('ageDisclaimer.hospital-address')}</p>

                        <div className="hospital-phones">
                            <p>{t('ageDisclaimer.hospital-phones')}</p>
                            <div className="phones">
                                <p>+381 113671429</p>
                                <p>+381 112662727</p>
                            </div>
                        </div>
                    </div>
                    <div className="final-warning">
                        <img src={redWarningIcon} />
                        <p>{t('ageDisclaimer.finalWarning')}</p>
                    </div>
                </div>
                <div className="action-wrapper">
                    <PrimaryButton
                        text={t('ageDisclaimer.continuePurchase')}
                        callback={() => navigate('/betting')}
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
