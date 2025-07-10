# Device Token Persistence Guide

This guide explains how device tokens are handled in the application with support for both Electron and browser environments.

## Overview

The app now supports automatic switching between Electron and standalone browser modes while maintaining device token persistence. Device tokens are loaded once at startup and saved once after registration, keeping the rest of the app synchronous.

## How It Works

### At App Startup
1. `deviceTokenService.initialize()` is called in `main.tsx`
2. Checks if device token exists in localStorage (fast access)
3. If not found, loads from persistent storage via `apiService.getDeviceToken()`
4. Stores any found token in localStorage for synchronous access

### During Registration
1. **Auto-Registration (Browser Mode)**: If credentials are available via `/api/v1/device/get-credentials`, registration starts automatically
2. **Manual Registration**: Device registration proceeds normally using existing `AuthService`
3. After successful registration, `deviceTokenService.saveDeviceToken()` is called
4. Token is saved to both localStorage (immediate access) and persistent storage (long-term)

### For Other API Calls
- Print, activate, deactivate operations use `apiService` directly
- These automatically route to either Electron (`window.api`) or HTTP endpoints
- No changes needed to existing business logic

## Key Components

### `deviceTokenService`
- **Purpose**: Handle device token persistence between localStorage and apiService
- **Methods**:
  - `initialize()`: Load token from persistent storage at startup
  - `saveDeviceToken(token)`: Save token to both localStorage and persistent storage
  - `isInitialized()`: Check initialization status

### `apiService`
- **Purpose**: Route API calls to appropriate backend (Electron or HTTP)
- **Auto-detection**: Automatically detects environment based on `window.api` availability
- **Override**: Can be forced via `VITE_API_MODE` environment variable

## API Endpoints (Browser Mode)

When running in browser mode, the following localhost:3001 endpoints are used:

| Method | Endpoint                           | Purpose                                          |
| ------ | ---------------------------------- | ------------------------------------------------ |
| `GET`  | `/api/v1/device/get-token`         | Retrieve persisted device token                  |
| `POST` | `/api/v1/device/save-token`        | Save device token                                |
| `GET`  | `/api/v1/device/get-credentials`   | Get auto-registration credentials (browser only) |
| `POST` | `/api/v1/device/log`               | Send log messages                                |
| `POST` | `/api/v1/printer/print-image`      | Print vouchers/receipts                          |
| `POST` | `/api/v1/bill-acceptor/activate`   | Activate bill acceptor                           |
| `POST` | `/api/v1/bill-acceptor/deactivate` | Deactivate bill acceptor                         |

## Environment Configuration

```bash
# .env file

# Force API mode (optional)
VITE_API_MODE=http      # Force browser mode
VITE_API_MODE=electron  # Force Electron mode  
VITE_API_MODE=auto      # Auto-detect (default)
```

## Auto-Registration Feature

When running in browser mode, the app can automatically register devices without user interaction if credentials are provided by the local service.

### How Auto-Registration Works
1. On registration page load, `apiService.getCredentials()` is called
2. If credentials exist (email and device_name), they are automatically used
3. Registration process starts immediately without user input
4. Form fields are populated with the retrieved credentials
5. Device registration proceeds automatically

### Credential Response Format
```json
// When credentials exist:
{
  "success": true,
  "credentials": {
    "email": "kiosk@example.com",
    "device_name": "KIOSK_001"
  },
  "exists": true,
  "timestamp": "2025-01-11T10:30:00.000Z"
}

// When no credentials available:
{
  "success": true,
  "credentials": {},
  "exists": false,
  "timestamp": "2025-01-11T10:30:00.000Z"
}
```

### Environment Behavior
- **Browser Mode**: Checks for credentials via HTTP endpoint
- **Electron Mode**: Always acts as if no credentials exist (manual registration required)

## Benefits

1. **Seamless Environment Switching**: Works in both Electron and browser
2. **Persistent Device Registration**: Device tokens survive app restarts
3. **Synchronous Access**: Most code remains synchronous and unchanged
4. **One-time Loading**: Device token loaded once at startup for performance
5. **Reliable Persistence**: Token saved to both memory and persistent storage
6. **Auto-Registration**: Kiosk mode support with automatic device registration

## Usage Examples

```typescript
// Device token is automatically loaded at startup
// All existing AuthService.GetToken(Auth.POS) calls work unchanged

// Check for auto-registration credentials (browser mode only)
const credentials = await apiService.getCredentials()
if (credentials) {
  console.log('Auto-credentials:', credentials.email, credentials.device_name)
  // Registration will start automatically
}

// After registration
await deviceTokenService.saveDeviceToken(newToken)

// API calls automatically route to correct backend
await apiService.print(imageUrl)
await apiService.activate(jwt)
await apiService.deactivate()
```

This approach provides the persistence benefits while keeping the existing codebase largely unchanged and maintaining synchronous access patterns. 