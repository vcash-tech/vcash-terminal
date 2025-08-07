import { warningIcon } from '@/assets/icons'
import IconHeading from '@/components/atoms/iconHeading/iconHeading'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import { useTranslate } from '@/i18n/useTranslate'

export type AlertModalProps = {
    title: string,
    message: string,
    displaySupport?: boolean
    ctaText?: string,
    onCtaClick?: () => void,
}

export default function AlertModal({ title, message, displaySupport, ctaText, onCtaClick }: AlertModalProps) {
    const { t } = useTranslate()

    return (
        <div className="alert-modal">
            <div className="modal-content">
                <IconHeading heading={title} icon={warningIcon} />
                <p>{message}</p>
                { displaySupport && 
                    <div className="support-wrapper">
                        <div className="support-content">
                            <div>
                                <p>{t('alertModal.supportTitle')}</p>
                                <p className="support-text">
                                    {t('alertModal.supportText')}
                                </p>
                            </div>
                            <span className='support-contact'>
                                062 111 5 111
                            </span>
                        </div>
                    </div>
                }
                { ctaText && <PrimaryButton text={ctaText} callback={onCtaClick} /> }
            </div>
        </div>
    )
}
