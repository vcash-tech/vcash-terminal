import { NavigateFunction } from 'react-router-dom'

import PeekButton from '@/components/atoms/peekButton/peekButton'
import { useTranslate } from '@/i18n/useTranslate'

import { arrowRight } from '../../../assets/icons'
import WelcomeBanner from '../../molecules/welcomeBanner/welcomeBanner'

type WelcomeScreenProps = { navigate: NavigateFunction }

export default function WelcomeScreen({ navigate }: WelcomeScreenProps) {
    const { t } = useTranslate()
    return (
        <div className="welcome-screen">
            <WelcomeBanner />
            <div className="welcome-screen-button-container">
                <PeekButton
                    buttonContent={
                        <div className="welcome-screen-button-content">
                            <span>{t('welcome.getStarted')}</span>
                            <img alt="right-arrow" src={arrowRight} />
                        </div>
                    }
                    handleClick={() => navigate('/')}
                />
            </div>
        </div>
    )
}
