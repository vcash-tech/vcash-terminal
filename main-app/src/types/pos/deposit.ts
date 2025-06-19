import { MoneyTransfer } from "../agent/transaction"

export interface DepositRequest {
  toUserIdentifier: string;
  amount: number;
  vendor: Vendor;
}

export interface DepositResponse {
  moneyTransfer: MoneyTransfer;
  timestamp: number;
}

export interface RefundResponse {
  moneyTransfer: MoneyTransfer;
  timestamp: number;
}

export interface ConfirmDepositData {
  depositValue: number;
  partialUserData: PartialUserData | string;
  vendor: Vendor;
  onSuccess: () => void;
}

export interface PartialUserData {
  message: string;
  timestamp: number;
  userId: number;
  userName: string;
  email: string;
  name: string;
  lastName: string;
  mobilePhoneNumber: string;
  citizenId: string;
  statusCode: string;
  birthDate: string;
  userTypeCode: string;
}

export interface ConfirmVoucherData {
  voucherValue: number;
  onSuccess: () => void;
}

export interface VoucherRequest {
  voucherTypeId: string;
}

export interface VoucherResponse {
  moneyTransfer: MoneyTransfer;
  timestamp: number;
}

export interface VoucherAmountResponse {
  amount: number;
}

export interface Vendors {
  vendors: Vendor[];
}

export interface Vendor {
  walletId: number;
  company: string;
  confirmTransactionMessage?: string;
  successTransactionMessage?: string;
}
