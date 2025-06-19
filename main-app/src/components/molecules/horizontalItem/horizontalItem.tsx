import { useTranslate } from '@/i18n/useTranslate'

export default function HorizontalItem({
    title,
    body,
    image,
    isDisabled
}: {
    title: string
    body: string
    image?: string
    isDisabled?: boolean
}) {
    const { t } = useTranslate()
    return (
        <div className="horizontal-item">
            {image && <img src={image} alt={title} className="item-icon" />}
            <p className="title">
                {isDisabled && <span>{t('comingSoon')}</span>}
                <br />
                {title}
            </p>
            <p>{body}</p>
        </div>
    )
}
