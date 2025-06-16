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

export default function VoucherConfirmationTemplate({
    voucherConfirmation
}: {
    voucherConfirmation: VoucherConfirmation
}) {
    const onComplete = () => {
        alert('onComplete')
    }

    return (
        <Container style={{ flex: 1}}>
            <Header />
            <div className={'voucher-confirmation'}>
                <h1>Your voucher has been issued successfully</h1>
                <div className="invoice-content">
                    <FlexWrapper gap={2} justify="space-between">
                        <HalfContainer>
                            <InvoiceItem
                                label="Date"
                                value={voucherConfirmation.date}
                                align="left"
                            />
                        </HalfContainer>
                        <HalfContainer>
                            <InvoiceItem
                                label="Time"
                                value={voucherConfirmation.time}
                                align="right"
                            />
                        </HalfContainer>
                    </FlexWrapper>
                    <InvoiceItem
                        label="Reference No"
                        value={voucherConfirmation.referenceNo}
                        align="left"
                    />
                    <InvoiceItem
                        label="Terminal"
                        value={voucherConfirmation.terminal}
                        align="left"
                    />
                    <Divider gap={1} />
                    <InvoiceItem 
                        label="Amount" 
                        value={voucherConfirmation.amount} 
                    />
                    <InvoiceItem 
                        label="Voucher Code" 
                        value={voucherConfirmation.voucherCode} 
                    />
                    <InvoiceItem 
                        label="Type" 
                        value={voucherConfirmation.type} 
                    />
                    <InvoiceItem
                        label="Usage"
                        value={voucherConfirmation.usage}
                    />
                    <HowToUse />
                    <Divider gap={2} />
                    <InvoiceItem
                        label="Scan to Redeem"
                        value={voucherConfirmation.qrCodeData || ''}
                        isQrCode={true}
                    />
                </div>
                <PrimaryButton callback={() => onComplete()} text="Finish" />
            </div>
            <Footer />
        </Container>
    )
}
