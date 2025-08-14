// API utilities for TubeDAO backend communication with authentication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface NonceResponse {
  nonce: string;
}

export interface AuthResponse {
  token: string;
  address: string;
  chainId: number;
  expiresAt: number;
  registrationNeeded?: boolean;
}

export interface TempAuthResponse {
  tempToken: string;
  address: string;
  chainId: number;
  expiresAt: number;
}

// Union type for SIWE verification response
export type SiweVerificationResponse = TempAuthResponse | AuthResponse;

export interface RegistrationResponse {
  registrationId: string;
  status: string;
}

export interface RegistrationStatus {
  completed: boolean;
  failed: boolean;
  error?: string;
  token?: string;
  chainId?: number;
  expiresAt?: number;
}

export interface APIError {
  error: string;
  needsReg?: boolean;
  address?: string;
  chainId?: number;
}

export interface UserContribution {
  id: string;
  address: string;
  dataType: string;
  fileName: string;
  fileSize: number;
  dataContent: Record<string, unknown>;
  rewardAmount: number;
  timestamp: string;
  status: string;
}

export interface UserRewards {
  address: string;
  totalRewards: number;
  totalDatasets: number;
}

export interface RegisteredAddress {
  id: string;
  address: string;
  timestamp: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async generateNonce(address: string): Promise<NonceResponse> {
    return this.request<NonceResponse>('/auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async verifySIWE(message: string, signature: string): Promise<SiweVerificationResponse> {
    return this.request<SiweVerificationResponse>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
    });
  }

  async bindMokshaIdentity(
    address: string, 
    bindingMessage: string, 
    bindingSignature: string, 
    tempToken: string
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/bind-moksha', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
      body: JSON.stringify({ 
        address, 
        bindingMessage, 
        bindingSignature 
      }),
    });
  }

  async registerWithMoksha(
    address: string,
    siweMessage: string,
    siweSignature: string,
    bindingMessage: string,
    bindingSignature: string
  ): Promise<RegistrationResponse> {
    return this.request<RegistrationResponse>('/auth/register-moksha', {
      method: 'POST',
      body: JSON.stringify({
        address,
        siweMessage,
        siweSignature,
        bindingMessage,
        bindingSignature,
      }),
    });
  }

  async checkRegistrationStatus(registrationId: string): Promise<RegistrationStatus> {
    return this.request<RegistrationStatus>(`/auth/registration-status/${registrationId}`, {
      method: 'GET',
    });
  }

  async checkAuthStatus(token: string): Promise<{ authenticated: boolean; address?: string; chainId?: number }> {
    return this.request('/auth/status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async logout(token: string): Promise<{ message: string }> {
    return this.request('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async registerWallet(address: string, token: string): Promise<RegisteredAddress> {
    const response = await this.request<{ data: RegisteredAddress }>('/register-wallet', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address }),
    });
    return response.data;
  }

  async uploadData(
    address: string, 
    dataType: string, 
    fileName: string, 
    fileSize: number, 
    dataContent: Record<string, unknown>,
    token: string
  ): Promise<UserContribution> {
    const response = await this.request<{ data: UserContribution }>('/upload-data', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address,
        dataType,
        fileName,
        fileSize,
        dataContent,
      }),
    });
    return response.data;
  }

  async getUserData(address: string, token: string): Promise<RegisteredAddress> {
    const response = await this.request<{ data: RegisteredAddress }>(`/user/${address}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async getUserContributions(address: string, token: string): Promise<UserContribution[]> {
    const response = await this.request<{ data: UserContribution[] }>(`/user/${address}/contributions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  }

  async getUserRewards(address: string, token: string): Promise<UserRewards> {
    const response = await this.request<{ data: UserRewards }>(`/user/${address}/rewards`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export const apiClient = new APIClient();