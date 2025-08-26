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
    hasPrintingError?: boolean
    showHelp?: unknown
    isCompleted?: boolean
}

export default function PaymentComplete({
    navigate,
    onPrimaryButtonClick,
    hasPrintingError,
    isCompleted,
    showHelp
}: PaymentCompleteProps) {
    const { t } = useTranslate()
    const { startUrl } = useNavigationContext()

    const [showHelpMessage, setShowHelpMessage] = useState<unknown>(showHelp)

    useEffect(() => {
        // If showHelp is null or undefined, set it to true after 10 seconds
        if (showHelpMessage === null || showHelpMessage === undefined) {
            const timer = setTimeout(() => {
                setShowHelpMessage(true)
            }, 10000)
            return () => clearTimeout(timer)
        }

        // if voucher is printed navigate to / after 10 seconds
        if (showHelpMessage === false && navigate) {
            const timer = setTimeout(() => {
                navigate('/')
            }, 10000)
            return () => clearTimeout(timer)
        }
    }, [showHelpMessage, navigate])

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
        if (!hasPrintingError && isCompleted === true) {
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