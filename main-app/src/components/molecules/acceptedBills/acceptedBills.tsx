import { useTranslation } from 'react-i18next'

import { bill500, bill1000, bill2000 } from '@/assets/images'
import { useOrder } from '@/providers'

import { warningIcon } from '../../../assets/icons'

const AcceptedBills = () => {
    const { t } = useTranslation()
    const {
        state: { voucherType }
    } = useOrder()

    return (
        <div className="accepted-bills">
            <h2>{t('acceptedBills.title')}:</h2>
            {voucherType?.toString() === 'betting' ? (
                <div className="bills">
                    <img src={bill500} alt="500 RSD" />
                    <img src={bill1000} alt="1000 RSD" />
                    <img src={bill2000} alt="2000 RSD" />
                    {/* <img src={bill5000} alt="5000 RSD" /> */}
                </div>
            ) : (
                // <>
                //     <div className="bills">
                //         <img src={bill100} alt="100 RSD" />
                //         <img src={bill200} alt="200 RSD" />
                //         <img src={bill500} alt="500 RSD" />
                //     </div>
                //     <div className="bills">
                //         <img src={bill1000} alt="1000 RSD" />
                //         <img src={bill2000} alt="2000 RSD" />
                //         <img src={bill5000} alt="5000 RSD" />
                //     </div>
                // </>
                <div className="bills">
                    <img src={bill500} alt="500 RSD" />
                    <img src={bill1000} alt="1000 RSD" />
                    <img src={bill2000} alt="2000 RSD" />
                    {/* <img src={bill5000} alt="5000 RSD" /> */}
                </div>
            )}
            <div className="info-box">
                <img src={warningIcon} alt={t('common.info')} />
                <span
                    dangerouslySetInnerHTML={{
                        __html: t('acceptedBills.noChangeWarning')
                    }}></span>
            </div>
        </div>
    )
}

export default AcceptedBills
