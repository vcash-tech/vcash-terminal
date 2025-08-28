import { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { confirmedIcon, printerIco } from '@/assets/icons'
import { printVoucher } from '@/assets/images'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import WireButton from '@/components/atoms/wireButton/wireButton'
import { useNavigationContext } from '@/hooks'
import { useTranslate } from '@/i18n/useTranslate'

export type PaymentCompleteProps = {
    navigate: NavigateFunction
    onPrimaryButtonClick: () => void
    hasPrintingError: boolean
    isPrintCompleted?: boolean
}

export default function PaymentComplete({
    navigate,
    onPrimaryButtonClick,
    hasPrintingError,
    isPrintCompleted
}: PaymentCompleteProps) {
    const { t } = useTranslate()
    const { startUrl } = useNavigationContext()

    const [showHelpMessage, setShowHelpMessage] = useState<boolean | null>(null)

    const [timeoutPassed, setTimeoutPassed] = useState<boolean>(false)

    useEffect(() => {
        setTimeout(() => {
            setTimeoutPassed(true)
        }, 10000)
    }, [])

    useEffect(() => {
        if (timeoutPassed && !isPrintCompleted) {
            setShowHelpMessage(true)
        }
    }, [timeoutPassed, isPrintCompleted])

    const renderError = () => {
        return (
            <div className="fallback">
                <div>
                    <p>{t('paymentSuccessful.fallbackTitle')}</p>
                    <p>{t('paymentSuccessful.voucherUnavailable')}</p>
                </div>
                <WireButton onClick={onPrimaryButtonClick}>
                    {t('paymentSuccessful.buttonText')}
                </WireButton>
            </div>
        )
    }

    const renderSuccess = () => {
        return (
            <>
                <div className="successful-msg">
                    <img src={confirmedIcon} alt="Confirm icon" />
                    {t('voucherGenerated.successfulMsg')}
                </div>
                <PrimaryButton
                    callback={() => {
                        navigate(startUrl ?? '/welcome')
                    }}
                    text={t('voucherGenerated.btnFinish')}
                />
            </>
        )
    }

    const renderInProgress = () => {
        return (
            <div className="successful-msg marginOn">
                <img src={printerIco} alt="Printer icon" />
                {t('voucherGenerated.inProgressMsg')}
            </div>
        )
    }

    const renderStatus = () => {
        if (!hasPrintingError && isPrintCompleted === true) {
            return renderSuccess()
        }

        if (hasPrintingError || showHelpMessage) {
            return renderError()
        }

        return renderInProgress()
    }

    return (
        <div className="payment-successful">
            <h1>{t('paymentSuccessful.title')}</h1>
            <h2>{t('paymentSuccessful.subtitle')}</h2>

            <div className="demo-wrapper">
                <img src={printVoucher} alt={t('insertCash.altText')} />
            </div>

            <div className="fallback-wrapper">{renderStatus()}</div>
        </div>
    )
}
