import { Auth } from '../types/common/httpRequest'
import {
    DraftFromVoucherRequest,
    DraftFromVoucherResponse,
    VoucherAmountResponse,
    VoucherRequest,
    VoucherResponse
} from '../types/pos/deposit'
import { HttpService } from './httpService'

const api = {
    voucher: '/cashier-app/money-transfer/voucher/draft/convert',
    draftFromVoucher: '/cashier-app/money-transfer/voucher/draft/{voucherCode}',
    getVoucherAmount: '/cashier-app/money-transfer/voucher/draft'
}

export class TransactionService {
    static async CreateVoucher(dto: VoucherRequest): Promise<VoucherResponse> {
        return HttpService.Post(api.voucher, dto, Auth.Cashier)
    }

    static async CreateDraftFromVoucher(
        dto: DraftFromVoucherRequest
    ): Promise<DraftFromVoucherResponse> {
        return HttpService.Post(
            api.draftFromVoucher.replace('{voucherCode}', dto.voucherCode),
            {},
            Auth.Cashier
        )
    }

    static async GetVoucherAmount(): Promise<VoucherAmountResponse> {
        return HttpService.Get(api.getVoucherAmount, Auth.Cashier)
    }
}
