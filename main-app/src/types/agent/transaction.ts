import { PaginationInfo } from "../common/pagination"

export interface MoneyTransferSummary {
  timestamp: number;
  summaries: {
    agentEmail: string;
    agentId: string;
    agentType: number;
    agentUsername: string;
    company: string;
    companyId: number;
    totalCount: number;
    totalSum: number;
    walletId: number;
    cashierId: string;
    venueId: number;
    cashierName: string;
    venueName: string;
  }[];
}

export interface WalletTransactions {
  transactions: WalletTransaction[];
  page: PaginationInfo;
  timestamp: number;
  summary: TransactionsSummary;
}
export interface MoneyTransfers {
  moneyTransfers: MoneyTransfer[];
  page: PaginationInfo;
  timestamp: number;
  summary: TransactionsSummary;
}
export interface TransactionsSummary {
  pageSumAmount: number;
  pageSuccessSumAmount: number;
  pageSuccessCount: number;

  totalSumAmount: number;
  totalSuccessSumAmount: number;
  totalSuccessCount: number;
}

export interface MoneyTransfer {
  moneyTransferId: string;
  from: {
    walletId: number;
    company: string;
    identifier?: string;
    agentTypeCode: string;
  };
  to?: {
    walletId: number;
    company: string;
    identifier?: string;
    agentTypeCode: string;
  };
  amount: number;
  statusCode: StatusCode;
  date: string;
  transactions: Transaction[];
  voucherCode?: string;
  typeCode: TransactionType;
  moneyTransferCode: string;
  currencyCode: string;
  cashier?: {
    fullName: string;
    cashierId: string;
  };
  venue?: {
    name: string;
    venueId: number;
    address?: string;
    city?: string;
  };
  error?: string;
}

export enum TransactionType {
  DIRECT_TRANSFER = "DIRECT_TRANSFER",
  VOUCHER = "VOUCHER",
  MANUAL_TRANSFER = "MANUAL_TRANSFER",
}

export const TransactionTypes: TransactionType[] = [
  TransactionType.DIRECT_TRANSFER,
  TransactionType.VOUCHER,
  TransactionType.MANUAL_TRANSFER,
]
export const WalletTransactionTypes = [
  "REFUND_AGENT_WITHDRAWAL",
  "REFUND_MANUAL_AGENT_DEPOSIT",
  "REFUND_AGENT_DEPOSIT",
  "REFUND_MANUAL_AGENT_WITHDRAWAL",
  "AGENT_WITHDRAWAL",
  "MANUAL_AGENT_DEPOSIT",
  "AGENT_DEPOSIT",
  "MANUAL_AGENT_WITHDRAWAL",
] as const

export interface Transaction {
  transactionId: number;
  ToUserIdentifier: string;
  amount: number;
  date: Date;
  externalTransactionId?: string;
  statusCode: string;
}

export interface WalletTransaction {
  transactionId: number;
  walletId: number;
  moneyTransferId: string;
  transactionTypeId: string;
  amount: number;
  date: Date;
  isProcessed: boolean;
  identifier: string;
  walletTransaction: string;
  moneyTransferCode: string;
  moneyTransferTypeCode: string;
  currencyCode: string;
  statusCode: string;
  cashier: {
    cashierId: string;
    fullName: string;
  };
  venue: {
    venueId?: number;
    name: string;
    address: string;
    city: string;
    googleFullAddress: string;
    latitude?: number;
    longitude?: number;
    workingHours: {
      date: string;
      day: string;
      openAt: string;
      closeAt: string;
    };
  };
}

export enum StatusCode {
  pending = "PENDING_APPROVAL",
  rejected = "REJECTED",
  completed = "COMPLETED",
  refunded = "REFUNDED",
  error = "ERROR",
  approved = "APPROVED",
}

export const TransactionStatuses: StatusCode[] = [
  StatusCode.completed,
  StatusCode.approved,
  StatusCode.pending,
  StatusCode.refunded,
  StatusCode.rejected,
  StatusCode.error,
]

export enum DateSpan {
  today = "Danas",
  yesterday = "Juče",
  thisWeek = "Ove nedelje",
  last7Days = "Poslednjih 7 dana",
  thisMonth = "Ovaj mesec",
  betweenDates = "Između datuma",
}

export const DateSpans: DateSpan[] = [
  DateSpan.today,
  DateSpan.yesterday,
  DateSpan.thisWeek,
  DateSpan.last7Days,
  DateSpan.thisMonth,
  DateSpan.betweenDates,
]

export enum TransactionDirection {
  "DEPOSIT",
  "PAYOUT",
  "TRANSFER_BETWEEN_AGENTS",
}

export interface DefaultDepositLimits {
  defaultDailyLimit?: number;
  defaultWeeklyLimit?: number;
  defaultMonthlyLimit?: number;
  walletId?: number;
}

export interface DepositLimits {
  dailyLimit?: number | null;
  weeklyLimit?: number | null;
  monthlyLimit?: number | null;
  dailyUsage?: number;
  weeklyUsage?: number;
  monthlyUsage?: number;
  dailyResetDate?: string;
  weeklyResetDate?: string;
  monthlyResetDate?: string;
  walletId?: number;
  identifier?: string;
}
