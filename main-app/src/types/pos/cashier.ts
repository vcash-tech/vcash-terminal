import { ErrorObj } from "../common/error";

export interface AgentPOSInfo {
  message: string;
  errors: ErrorObj[];
  agent: {
    agentId: string;
    email: string;
    referralCode: string;
  };
  venue: {
    venueId: number;
    name: string;
    city: string;
    municipality: string;
    address: string;
  };
  cashiers: [
    {
      cashierId: string;
      statusCode: string;
      userName: string;
      firstName: string;
      lastName: string;
      email: string;
      fixedPin?: string;
    }
  ];
}

export interface Cashier {
  cashierId: string;
  statusCode: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  fixedPin?: string;
}

export interface CashierTokenRequest {
  userName: string;
  pin: string;
}

export interface CashierTokenResponse {
  message: string;
  timestamp: number;
  accessToken: string;
  refreshToken: string;
}

export interface CashierShortTokenDecoded {
  device_token: string;
  cashier_id: string;
  cashier_user_name: string;
  device_id: string;
  agent_id: string;
  agent_user_id: number;
  nbf: number;
  exp: number;
  // token expire timestamp
  iat: number;
}
