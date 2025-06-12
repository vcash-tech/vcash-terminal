import { Auth } from "../types/common/httpRequest";
import {
  AgentPOSInfo,
  CashierTokenRequest,
  CashierTokenResponse,
} from "../types/pos/cashier";
import {
  DeviceCodeEmailRequest,
  DeviceCodeResponse,
  DeviceCodeUsernameRequest,
  DeviceTokenRequest,
  DeviceTokenResponse,
} from "../types/pos/deviceAuth";
import { HttpService } from "./httpService";

const api = {
  generateDeviceCodeEmail: "/auth/device/code/email",
  generateDeviceCodeUsername: "/auth/device/code/username",
  generateDeviceToken: "/auth/device/token",
  getCashiersPOS: "/auth/cashier/all",
  unlockDevice: "/auth/cashier/token",
};

export class POSService {
  // Device Registration
  static async generateDeviceCodeEmail(
    dto: DeviceCodeEmailRequest
  ): Promise<DeviceCodeResponse> {
    const response = await HttpService.Post<DeviceCodeResponse>(
      api.generateDeviceCodeEmail,
      dto
    );
    return response;
  }
  static async generateDeviceCodeUsername(
    dto: DeviceCodeUsernameRequest
  ): Promise<DeviceCodeResponse> {
    const response = await HttpService.Post<DeviceCodeResponse>(
      api.generateDeviceCodeUsername,
      dto
    );
    return response;
  }

  static async generateDeviceToken(
    dto: DeviceTokenRequest
  ): Promise<DeviceTokenResponse> {
    const response = await HttpService.Post<DeviceTokenResponse>(
      api.generateDeviceToken,
      dto
    );
    return response;
  }

  // Cashier Locked Screen
  static async getCashiersPOS(): Promise<AgentPOSInfo> {
    const response = await HttpService.Get<AgentPOSInfo>(
      api.getCashiersPOS,
      Auth.POS
    );
    return response;
  }

  static async unlockDevice(
    dto: CashierTokenRequest
  ): Promise<CashierTokenResponse> {
    const response = await HttpService.Post<CashierTokenResponse>(
      api.unlockDevice,
      dto,
      Auth.POS
    );
    return response;
  }
}
