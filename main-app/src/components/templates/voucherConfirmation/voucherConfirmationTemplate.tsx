import { NavigateFunction } from 'react-router-dom'

import Container from '@/components/atoms/container/container'
import HalfContainer from '@/components/atoms/container/halfContainer'
import Divider from '@/components/atoms/divider/divider'
import FlexWrapper from '@/components/atoms/flexWrapper/flexWrapper'
import InvoiceItem from '@/components/atoms/invoice-item/invoice-item'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import HowToUse from '@/components/molecules/howToUse/howToUse'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { useTranslate } from '@/i18n/useTranslate'



export default function VoucherConfirmationTemplate({
    voucherConfirmation,
    navigate
}: {
    voucherConfirmation: VoucherConfirmation,
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
                    <InvoiceItem 
                        label={t('voucherGenerated.amount')}
                        value={voucherConfirmation.amount} 
                    />
                    <InvoiceItem 
                        label={t('voucherGenerated.type')}
                        value={voucherConfirmation.type} 
                    />
                    <InvoiceItem
                        label={t('voucherGenerated.usage')}
                        value={voucherConfirmation.usage}
                    />
                    <HowToUse />
                </div>
                <PrimaryButton callback={() => onComplete()} text={t('voucherGenerated.buttonText')} />
            </div>
            <Footer />
        </Container>
    )
}
