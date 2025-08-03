const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

export const api = {
  // Register wallet address
  registerWallet: async (address: string): Promise<RegisteredAddress> => {
    const response = await fetch(`${API_BASE_URL}/register-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error('Failed to register wallet');
    }

    const data = await response.json();
    return data.data;
  },

  // Get user data
  getUserData: async (address: string): Promise<RegisteredAddress> => {
    const response = await fetch(`${API_BASE_URL}/user/${address}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data.data;
  },

  // Upload data
  uploadData: async (
    address: string, 
    dataType: string, 
    fileName: string, 
    fileSize: number, 
    dataContent: Record<string, unknown>
  ): Promise<UserContribution> => {
    const response = await fetch(`${API_BASE_URL}/upload-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        dataType,
        fileName,
        fileSize,
        dataContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload data');
    }

    const data = await response.json();
    return data.data;
  },

  // Get user contributions
  getUserContributions: async (address: string): Promise<UserContribution[]> => {
    const response = await fetch(`${API_BASE_URL}/user/${address}/contributions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contributions');
    }

    const data = await response.json();
    return data.data || [];
  },

  // Get user rewards
  getUserRewards: async (address: string): Promise<UserRewards> => {
    const response = await fetch(`${API_BASE_URL}/user/${address}/rewards`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch rewards');
    }

    const data = await response.json();
    return data.data;
  },
}; 