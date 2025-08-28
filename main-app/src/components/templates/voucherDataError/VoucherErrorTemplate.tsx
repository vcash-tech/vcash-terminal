import { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import WireButton from '@/components/atoms/wireButton/wireButton'
import { useNavigationContext } from '@/hooks'
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
    const [isWaitingVoucher, setIsWaitingVoucher] = useState<boolean>(false)
    const [currentAttempt, setCurrentAttempt] = useState<number>(0)

    const { startUrl } = useNavigationContext()

    useEffect(() => {
        setIsWaitingVoucher(currentAttempt !== voucherRecreateAttempts)
        if (currentAttempt !== voucherRecreateAttempts) {
            setCurrentAttempt(voucherRecreateAttempts)
        }
    }, [currentAttempt, voucherRecreateAttempts])

    return (
        <>
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
                        if (voucherRecreateAttempts < 3) {
                            onTryAgain?.()
                            setIsWaitingVoucher(true)
                            return
                        }
                        setIsWaitingVoucher(false)
                        navigate(startUrl ?? '/welcome')
                    }}
                    text={t(
                        voucherRecreateAttempts < 3
                            ? 'voucherGenerated.tryAgain'
                            : 'voucherGenerated.btnFinish'
                    )}
                />
                {/* <span className="voucher-progress-info">
                        {isWaitingVoucher &&
                            t('voucherGenerated.inProgressMsg')}
                    </span> */}
            </div>
        </>
    )
}
