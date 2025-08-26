import { useLocation } from 'react-router-dom'

import AlertModal from '@/components/organisms/alertModal/alertModal'
import { useCheckInternetConnection } from '@/hooks'
import { useTranslate } from '@/i18n/useTranslate'
import { isHomePage } from '@/utilities/navigationHelper'

export default function NoInternetModal() {
    const { t } = useTranslate()
    const { isOnline } = useCheckInternetConnection({ shouldCheck: true })
    const { pathname } = useLocation()

    if (isHomePage(pathname) || isOnline) {
        return <></>
    }

    return (
        <AlertModal
            title={t('alertModal.errors.offlineTitle')}
            message={t('alertModal.errors.offlineMessage')}
            displaySupport={true}
        />
    )
}
