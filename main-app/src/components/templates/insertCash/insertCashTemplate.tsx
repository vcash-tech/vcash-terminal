import { format } from 'date-fns'
import { useState } from 'react'

import Container from '@/components/atoms/container/container'
import PrimaryButton from '@/components/atoms/primaryButton/primaryButton'
import Footer from '@/components/organisms/footer/footer'
import Header from '@/components/organisms/header/header'
import { VoucherConfirmation } from '@/data/entities/voucher-confirmation'
import { useTranslate } from '@/i18n/useTranslate'
import { TransactionService } from '@/services/transactionService'
import { VoucherResponse } from '@/types/pos/deposit'

import { infoCircle } from '../../../assets/icons'
import { insertCash } from '../../../assets/images'
import PaymentSuccessfulTemplate from '../paymentSuccessful/paymentSuccessfulTemplate'
import VoucherConfirmationTemplate from '../voucherConfirmation/voucherConfirmationTemplate'

export default function InsertCashTemplate() {
    const { t } = useTranslate()

    const [amount, _setAmount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [voucherData, setVoucherData] = useState<VoucherResponse | null>(null)

    // useEffect(() => {
    //     // Simulate fetching the amount from a service or state
    //     const fetchAmount = async () => {
    //         const amount = await TransactionService.GetVoucherAmount()
    //         setAmount(amount.amount)
    //     }

    //     setInterval(() => fetchAmount(), 2000)
    // }, [])

    const handleBuy = async () => {
        setIsLoading(true)
        try {
            const voucherData = await TransactionService.CreateVoucher({
                voucherTypeId: '20' // Replace with actual voucher type ID
            })
            setVoucherData(voucherData)
        } catch (err) {
            console.error(err)
        }

        try {
            // const voucherCodeDefault = '123-456-789' // Replace with actual logic
            // const result = await window.api.print(voucherCodeDefault
        } catch {
            // printer unavailable handling
        }
        setIsLoading(false)
    }

    if (voucherData) {
        return (
            <VoucherConfirmationTemplate
                voucherConfirmation={
                    {
                        voucherCode: voucherData.moneyTransfer.voucherCode,
                        date: format(
                            new Date(voucherData.moneyTransfer.date),
                            'd MMMM, yyyy'
                        ),
                        time: format(
                            new Date(voucherData.moneyTransfer.date),
                            'hh:mm a'
                        ),
                        amount: `${voucherData.moneyTransfer.amount} ${voucherData.moneyTransfer.currencyCode}`,
                        referenceNo:
                            voucherData.moneyTransfer.moneyTransferCode,
                        terminal: `${voucherData.moneyTransfer.venue?.address}, ${voucherData.moneyTransfer.venue?.city}`
                    } as VoucherConfirmation
                }
            />
        )
    }

    if (isLoading) {
        return <PaymentSuccessfulTemplate />
    }

    return (
        <Container isFullHeight={true}>
            <Header />
            <div className="insert-cash">
                <h1>{t('insertCash.title')}</h1>
                <h2>{t('insertCash.acceptedNotes')}</h2>
                <img src={insertCash} alt={t('insertCash.altText')} />
                <div className="inserted-amount">
                    {t('insertCash.insertedAmount')}: <span>{amount} RSD</span>
                </div>
                <div className="info-box">
                    <img src={infoCircle} alt={t('common.info')} />
                    {t('insertCash.noChangeWarning')}
                </div>
                <PrimaryButton
                    text={t('insertCash.confirmPayment')}
                    callback={handleBuy}
                />
            </div>
            <Footer />
        </Container>
    )
}
