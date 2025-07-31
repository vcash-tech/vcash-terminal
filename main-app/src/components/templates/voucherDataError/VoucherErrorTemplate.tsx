import { useEffect } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { printVoucher } from '@/assets/images'
import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import WireButton from '@/components/atoms/wireButton/wireButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'

export default function VoucherErrorTemplate({
    navigate,
    onPrimaryButtonClick
}: {
    navigate?: NavigateFunction
    onPrimaryButtonClick?: () => void
}) {
    const { t } = useTranslate()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (navigate) {
                navigate('/')
            }
        }, 15000)
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <Container isFullHeight={true}>
            <Header />
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
                        <WireButton onClick={onPrimaryButtonClick}>
                            069 888 55 58
                        </WireButton>
                    </div>
                </div>
                <PrimaryButton
                    callback={() => {
                        if (navigate) {
                            navigate('/')
                        }
                    }}
                    text={t('voucherGenerated.buttonText')}
                />
            </div>
            <Footer />
        </Container>
    )
}
