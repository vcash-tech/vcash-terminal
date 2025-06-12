export interface DeviceCodeEmailRequest {
  agentEmail: string;
  deviceName: string;
  deviceTypeId: number;
}

export interface DeviceCodeUsernameRequest {
  agentUsername: string;
  deviceName: string;
}

export interface DeviceCodeResponse {
  timestamp: number;
  deviceCode: string;
  expiresInMin: number;
  agentId: string;
}

export interface DeviceTokenRequest {
  agentId: string;
  deviceCode: string;
}

export interface DeviceTokenResponse {
  message: string;
  token: string;
  expiresAt: Date;
  venue: {
    venueId: number;
    name: string;
    city: string;
    municipality: string;
    address: string;
  };
}
