import { useTranslate } from '@/i18n/useTranslate'

export default function HowToUse(){
    const { t } = useTranslate()
    return <div className="how-to-use">
        <p className="how-to-title">{t('voucherGenerated.howToUse.title')}</p>
        <ol>
            <li><p>{t('voucherGenerated.howToUse.1')}</p></li>
            <li><p>{t('voucherGenerated.howToUse.2')}</p></li>
            <li><p>{t('voucherGenerated.howToUse.3')}</p></li>
        </ol>
    </div>
}