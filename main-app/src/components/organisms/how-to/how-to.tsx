import { closeIcon } from '@/assets/icons'
import {
    gamingMarketplace,
    insertCashImg2,
    izaberiPlatformu,
    mockupVoucher,
    useVoucherBetting, useVoucherGaming
} from '@/assets/images'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { useTranslate } from '@/i18n/useTranslate'

import StepItem from './step-item'

export type StepItemProps = {
    title: string
    description: string
    image: string
    stepIndex: number
}

export type HowToProps = {
    onClose?: () => void
    isModal?: boolean
    isBetting?: boolean
}

export default function HowTo({ onClose, isModal, isBetting = false }: HowToProps) {
    const { t } = useTranslate()
    const gamingImages = [
        insertCashImg2,
        mockupVoucher,
        gamingMarketplace,
        useVoucherGaming
    ]
    const bettingImages = [
        insertCashImg2,
        mockupVoucher,
        izaberiPlatformu,
        useVoucherBetting
    ]

    const howToGroup = isBetting ? 'betting' : 'gaming'

    const renderContent = () => {
        return (
            <div className="how-to">
                {isModal && (
                    <button className="close-btn" onClick={onClose}>
                        <img src={closeIcon} alt="close" />
                    </button>
                )}
                <h1 className="howToTitle">{t('howTo.title')}</h1>
                <p className="description">{t('howTo.description')}</p>
                <div className="steps">
                    {(isBetting ? bettingImages : gamingImages)?.map((step, index) => (
                        <StepItem
                            key={index}
                            title={t(`howTo.steps.${howToGroup}.${index}.title`)}
                            description={t(`howTo.steps.${howToGroup}.${index}.description`)}
                            image={step}
                            stepIndex={index + 1}
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (isModal) {
        return (
            <div className="backdrop">
                {renderContent()}
                <div className={'action-wrapper'}>
                    <PrimaryButton
                        callback={onClose}
                        text={t('register.continue')}
                    />
                </div>
            </div>
        )
    }

    return renderContent()
}
