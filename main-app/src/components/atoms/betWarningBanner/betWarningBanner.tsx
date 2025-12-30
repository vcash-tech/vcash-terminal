import { useTranslation } from 'react-i18next'

export type BetWarningBannerProps = {
    className?: string
}

export default function BetWarningBanner({ className }: BetWarningBannerProps) {
    const { t } = useTranslation()

    return (
        <div className={`bet-warning-banner ${className || ''}`}>
            <p>
                <strong>{t('betWarningBanner.title')}</strong>
                <br />
                {t('betWarningBanner.message')}
            </p>
        </div>
    )
}

