import { disney } from '@/assets/images'
import { useTranslate } from '@/i18n/useTranslate'

import StepItem from './step-item'

const stepImages = [disney, disney, disney, disney]
export default function HowTo() {
    const { t } = useTranslate()

    return (
        <div className="how-to">
            <h1>{t('howTo.title')}</h1>
            <p className="description">{t('howTo.description')}</p>
            <div className="steps">
                {stepImages?.map((step, index) => (
                    <StepItem
                        key={index}
                        title={t(`howTo.steps.${index}.title`)}
                        description={t(`howTo.steps.${index}.description`)}
                        image={step}
                        stepIndex={index + 1}
                    />
                ))}
            </div>
        </div>
    )
}
