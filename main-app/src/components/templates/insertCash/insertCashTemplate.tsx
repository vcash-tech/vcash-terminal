import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { useTranslate } from '@/i18n/useTranslate'
import { TransactionService } from '@/services/transactionService'

import { infoCircle } from '../../../assets/icons'
import { insertCash } from '../../../assets/images'

export default function PaymentMethodTerminalTemplate() {
    const { t } = useTranslate()
    
    const handleBuy = async () => {
        const amount = 500 // Replace with actual logic to get the amount
        if (amount === null) return

        try {
            const voucherData = await TransactionService.CreateVoucher({
                amount: amount
            })
            const voucherCodeDefault = '123-456-789' // Replace with actual logic
            const result = await window.api.print(
                voucherData.moneyTransfer.voucherCode || voucherCodeDefault
            )
            console.log(result)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Container isFullHeight={true}>
            <Header />
            <div className="insert-cash">
                <h1>{t('insertCash.title')}</h1>
                <h2>{t('insertCash.acceptedNotes')}</h2>
                <img src={insertCash} alt={t('insertCash.altText')} />
                <div className="inserted-amount">
                    {t('insertCash.insertedAmount')}: <span>500 RSD</span>
                </div>
                <div className="info-box">
                    <img src={infoCircle} alt={t('common.info')} />
                    {t('insertCash.noChangeWarning')}
                </div>
                <PrimaryButton text={t('insertCash.confirmPayment')} callback={handleBuy} />
            </div>
            <Footer />
        </Container>
    )
}
