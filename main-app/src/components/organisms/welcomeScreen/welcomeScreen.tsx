import PeekButton from '@/components/atoms/peekButton/peekButton'

import { arrowRight } from '../../../assets/icons'
import WelcomeBanner from '../../molecules/welcomeBanner/welcomeBanner'
import { useNavigate } from 'react-router-dom'

// type WelcomeScreenProps = {};

export default function WelcomeScreen() {
    const navigate = useNavigate()
    return (
        <div className="welcome-screen">
            <WelcomeBanner />
            <div className="welcome-screen-button-container">
                <PeekButton
                    buttonContent={
                        <div className="welcome-screen-button-content">
                            <span>Get Started</span>
                            <img alt="right-arrow" src={arrowRight} />
                        </div>
                    }
                    handleClick={() => navigate('/')}
                />
            </div>
        </div>
    )
}
