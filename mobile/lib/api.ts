import { TripRequest } from '@/types/trip';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error: any) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Trip endpoints
  async createTrip(tripData: Omit<TripRequest, 'user_id'>): Promise<ApiResponse> {
    return this.request('/api/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async getUserTrips(): Promise<ApiResponse> {
    return this.request('/api/trips', {
      method: 'GET',
    });
  }

  async getTripById(id: string): Promise<ApiResponse> {
    return this.request(`/api/trips/${id}`, {
      method: 'GET',
    });
  }
}

export const api = new ApiClient(API_URL);
