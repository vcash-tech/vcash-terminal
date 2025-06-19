import { useTranslate } from '@/i18n/useTranslate'

export type HomeItemProps = {
    title: string
    image: string
    body: string
    handleClick: () => void
    isDisabled?: boolean
}

export default function HomeItem({
    image,
    title,
    body,
    handleClick,
    isDisabled
}: HomeItemProps) {
    const { t } = useTranslate()
    return (
        <button className="home-item" onClick={handleClick}>
            <div className="image-container">
                <img src={image} alt={title} />
            </div>

            <div className="text-content">
                <p className="title">
                    {isDisabled && <span>{t('comingSoon')}</span>}
                    <br />
                    {title}
                </p>
                <p>{body}</p>
            </div>
        </button>
    )
}
