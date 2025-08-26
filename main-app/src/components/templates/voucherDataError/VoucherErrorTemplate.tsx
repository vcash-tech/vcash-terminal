import { useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import WireButton from '@/components/atoms/wireButton/wireButton'
import { useTranslate } from '@/i18n/useTranslate'

export default function VoucherErrorTemplate({
    navigate,
    onTryAgain,
    voucherRecreateAttempts = 0
}: {
    navigate: NavigateFunction
    onTryAgain?: () => void
    voucherRecreateAttempts?: number
}) {
    const { t } = useTranslate()
    const [isWaitingVoucher, setIsWaitingVoucher] =
        useState<boolean>(false)

    // const { isOnline } = useCheckInternetConnection({ shouldCheck: true })
    // const { startUrl } = useNavigationContext()

    // useEffect(() => {
    //     const timer = setTimeout(
    //         () => {
    //             if (isOnline) {
    //                 navigate(startUrl ?? '/welcome')
    //             }
    //             setIsWaitingVoucher(false)
    //         },
    //         voucherRecreateAttempts > 2 ? 15000 : 30000
    //     )
    //     return () => {
    //         clearTimeout(timer)
    //     }
    // }, [navigate, voucherRecreateAttempts, isOnline, startUrl])

    return (
        <>
            <Container isFullHeight={true}>
                <div className="voucher-error">
                    <h1>{t('voucherError.title')}</h1>
                    <h2>{t('voucherError.subtitle')}</h2>

                    <div className="demo-wrapper">
                        <img
                            src={printVoucher}
                            alt={t('insertCash.altText')}
                            className="demo-error-illustration"
                        />
                    </div>

                    <div className="fallback-wrapper">
                        <div className="fallback">
                            <div>
                                <p>{t('voucherError.supportTitle')}</p>
                                <p className="support-text">
                                    {t('voucherError.supportText')}
                                </p>
                            </div>
                            <WireButton>062 111 5 111</WireButton>
                        </div>
                    </div>
                    <PrimaryButton
                        isDisabled={isWaitingVoucher}
                        callback={() => {
                            if (voucherRecreateAttempts <= 2) {
                                setIsWaitingVoucher(true)
                                onTryAgain?.()
                                return
                            }
                            navigate('/')
                        }}
                        text={t(
                            voucherRecreateAttempts <= 2
                                ? 'voucherGenerated.tryAgain'
                                : 'voucherGenerated.btnFinish'
                        )}
                    />
                    <span className="voucher-progress-info">
                        {isWaitingVoucher &&
                            t('voucherGenerated.inProgressMsg')}
                    </span>
                </div>
            </Container>
        </>
    )
}
