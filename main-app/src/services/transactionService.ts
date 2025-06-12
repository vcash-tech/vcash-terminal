import { Auth } from "../types/common/httpRequest";
import { VoucherRequest, VoucherResponse } from "../types/pos/deposit";
import { HttpService } from "./httpService";

const api = {
  voucher: "/cashier-app/money-transfer/voucher",
};

export class TransactionService {
  static async CreateVoucher(dto: VoucherRequest): Promise<VoucherResponse> {
    return HttpService.Post(api.voucher, dto, Auth.Cashier);
  }
}
