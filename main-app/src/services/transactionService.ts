import { Auth } from '../types/common/httpRequest'
import { VoucherAmountResponse, VoucherRequest, VoucherResponse } from '../types/pos/deposit'
import { HttpService } from './httpService'

const api = {
    voucher: '/cashier-app/money-transfer/voucher/draft/convert',
    getVoucherAmount: '/cashier-app/money-transfer/voucher/draft'
}

export class TransactionService {
    static async CreateVoucher(dto: VoucherRequest): Promise<VoucherResponse> {
        return HttpService.Post(api.voucher, dto, Auth.Cashier)
    }

    static async GetVoucherAmount(): Promise<VoucherAmountResponse> {
      return HttpService.Get(api.getVoucherAmount, Auth.Cashier)
  }
}
