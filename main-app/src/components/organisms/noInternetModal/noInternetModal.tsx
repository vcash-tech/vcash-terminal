import { useLocation } from 'react-router-dom'

import AlertModal from '@/components/organisms/alertModal/alertModal'
import { useCheckInternetConnection } from '@/hooks'
import { useTranslate } from '@/i18n/useTranslate'
import {
    isConnectivityIssuesPage,
    isHomePage
} from '@/utilities/navigationHelper'

export default function NoInternetModal() {
    const { t } = useTranslate()
    const { isOnline, isMoneyPending } = useCheckInternetConnection()
    const { pathname } = useLocation()

    if (
        isHomePage(pathname) ||
        isConnectivityIssuesPage(pathname) ||
        isOnline
    ) {
        return <></>
    }

    return (
        <div>
            <AlertModal
                title={t('alertModal.errors.offlineTitle')}
                message={
                    isMoneyPending
                        ? t('alertModal.errors.offlineMessageMoneyPending')
                        : t('alertModal.errors.offlineMessage')
                }
                displaySupport={true}
            />
        </div>
    )
}
