import QRCode from 'react-qr-code'

export default function InvoiceItem({
    label,
    value,
    align = 'justify',
    isQrCode = false,
    codeSize = 115
}: {
    label: string
    value: string
    align?: 'left' | 'justify' | 'right'
    isQrCode?: boolean
    codeSize?: number
}) {
    return (
        <div className={`invoice-item align-${align} ${isQrCode ? 'qr-code' : ''}`}>
            <p className="label">{label}: </p>
            {!isQrCode && <p className="value">{value}</p>}
            {isQrCode && <QRCode value={value} size={codeSize} />}
        </div>
    )
}
