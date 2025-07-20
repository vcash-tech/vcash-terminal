import { useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { confirmedIcon } from '@/assets/icons'
import Container from '@/components/atoms/container/container'
import HalfContainer from '@/components/atoms/container/halfContainer'
import Divider from '@/components/atoms/divider/divider'
import FlexWrapper from '@/components/atoms/flexWrapper/flexWrapper'
import InvoiceItem from '@/components/atoms/invoice-item/invoice-item'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import SessionCounter from '@/components/molecules/sessionCounter/sessionCounter'
import VoucherCode from '@/components/molecules/voucherCode/voucherCode'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'   
import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { useTranslate } from '@/i18n/useTranslate'

export default function VoucherConfirmationTemplate({
    voucherConfirmation,
    navigate
}: {
    voucherConfirmation: VoucherConfirmation
    navigate: NavigateFunction
}) {
    const { t } = useTranslate()
    const onComplete = () => {
        navigate('/welcome')
    }

    return (
        <Container isFullHeight={true}>
            <Header />
            <div className={'voucher-confirmation'}>
                <img src={confirmedIcon} alt="Confirmed icon" />
                <h1>{t('voucherGenerated.title')}</h1>
                <div className="invoice-content">
                    <FlexWrapper gap={2} justify="space-between">
                        <HalfContainer>
                            <InvoiceItem
                                label={t('voucherGenerated.date')}
                                value={voucherConfirmation.date}
                                align="left"
                            />
                        </HalfContainer>
                        <HalfContainer>
                            <InvoiceItem
                                label={t('voucherGenerated.time')}
                                value={voucherConfirmation.time}
                                align="right"
                            />
                        </HalfContainer>
                    </FlexWrapper>
                    <InvoiceItem
                        label={t('voucherGenerated.referenceNo')}
                        value={voucherConfirmation.referenceNo}
                        align="left"
                    />
                    <InvoiceItem
                        label={t('voucherGenerated.terminal')}
                        value={voucherConfirmation.terminal}
                        align="left"
                    />
                    <Divider gap={1} />

                    <p className={'instruction'}>{t('voucherInstruction')} <span>market.vcash.rs</span> </p>
                    {voucherConfirmation.qrCodeData && (
                        <VoucherCode voucherCode={voucherConfirmation} />
                    )}
                </div>
                <SessionCounter onEndSession={() => navigate('/')} />
                <div className={'action-wrapper'}>
                    <PrimaryButton
                        callback={() => onComplete()}
                        text={t('voucherGenerated.buttonText')}
                    />
                </div>
            </div>
            <Footer />
        </Container>
    )
}
