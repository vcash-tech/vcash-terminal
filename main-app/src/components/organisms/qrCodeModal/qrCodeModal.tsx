import { useState } from 'react'

import { qrCode } from '@/assets/images'
import WireButton from '@/components/atoms/wireButton/wireButton'

export type QrCodeModalProps = {
    isOpen: boolean
    onClose: () => void
}

export default function QrCodeModal({ isOpen, onClose }: QrCodeModalProps) {
    const [open, setOpen] = useState(isOpen)

    if (!open) {
        return <></>
    }

    return (
        <div className="qr-code-modal">
            <div className="modal-content">
                <p>
                    For more details, scan the QR code to visit our marketplace
                    app
                </p>
                <img src={qrCode} className="qr-code" alt="QR Code" />
                <WireButton
                    onClick={() => {
                        setOpen(false)
                        onClose()
                    }}>
                    Back
                </WireButton>
            </div>
        </div>
    )
}
