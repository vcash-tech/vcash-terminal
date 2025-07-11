import { AgentPOSInfo, CashierTokenResponse } from '../types/pos/cashier'
import { DeviceCodeResponse, DeviceTokenResponse } from '../types/pos/deviceAuth'

/**
 * MockApiService - Provides mock implementations of API endpoints for local development
 */
export class MockApiService {
  // Mock response for device code generation
  static generateDeviceCodeResponse(): DeviceCodeResponse {
    return {
      timestamp: Date.now(),
      deviceCode: '123456',
      expiresInMin: 10,
      agentId: 'agent-123'
    }
  }

  // Mock response for device token generation
  static generateDeviceTokenResponse(): DeviceTokenResponse {
    return {
      message: 'Device token generated successfully',
      token: 'mock-device-token-123',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 1 day
      venue: {
        venueId: 1,
        name: 'Mock Venue',
        city: 'Mock City',
        municipality: 'Mock Municipality',
        address: 'Mock Address 123'
      }
    }
  }

  // Mock response for getting cashiers POS info
  static getCashiersPOSResponse(): AgentPOSInfo {
    return {
      message: 'Success',
      errors: [],
      agent: {
        agentId: 'agent-123',
        email: 'agent@example.com',
        referralCode: 'REF123'
      },
      venue: {
        venueId: 1,
        name: 'Mock Venue',
        city: 'Mock City',
        municipality: 'Mock Municipality',
        address: 'Mock Address 123'
      },
      cashiers: [
        {
          cashierId: 'cashier-1',
          statusCode: 'ACTIVE',
          userName: 'cashier1',
          firstName: 'First',
          lastName: 'Cashier',
          email: 'cashier1@example.com',
          fixedPin: '1234'
        },
        {
          cashierId: 'cashier-2',
          statusCode: 'ACTIVE',
          userName: 'cashier2',
          firstName: 'Second',
          lastName: 'Cashier',
          email: 'cashier2@example.com'
        }
      ]
    }
  }

  // Mock response for cashier token generation
  static unlockDeviceResponse(): CashierTokenResponse {
    return {
      message: 'Device unlocked successfully',
      timestamp: Date.now(),
      accessToken: 'mock-access-token-123',
      refreshToken: 'mock-refresh-token-123'
    }
  }
}
