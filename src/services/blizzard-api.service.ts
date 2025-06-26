import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiError, BlizzardApiResponse } from '@/types/wow';

export class BlizzardApiService {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BLIZZARD_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to ensure we have a valid token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token might be expired, clear it and retry
          this.accessToken = null;
          this.tokenExpiry = null;
          
          const originalRequest = error.config;
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            const token = await this.getAccessToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }
          }
        }
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private async getAccessToken(): Promise<string | null> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      // Use server-side API route for token generation (more secure)
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to get access token from API route:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('API route error:', data.error);
        return null;
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

      return this.accessToken;
    } catch (error) {
      console.error('❌ Failed to get access token');
      const axiosError = error as AxiosError; // Type assertion for axios error
      if (axiosError.response) {
        console.error('Response status:', axiosError.response.status);
        console.error('Response data:', axiosError.response.data);
      }
      return null;
    }
  }

  private handleApiError(error: any): ApiError {
    if (error.response) {
      return {
        code: error.response.status,
        type: error.response.data?.type || 'API_ERROR',
        detail: error.response.data?.detail || error.response.statusText || 'Unknown API error',
      };
    } else if (error.request) {
      return {
        code: 0,
        type: 'NETWORK_ERROR',
        detail: 'No response received from server',
      };
    } else {
      return {
        code: 0,
        type: 'REQUEST_ERROR',
        detail: error.message || 'Request setup failed',
      };
    }
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Health check method
  async checkConnection(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      return !!token;
    } catch {
      return false;
    }
  }

  // Get available regions
  async getRegions(): Promise<BlizzardApiResponse<any>> {
    return this.get('/data/wow/region/index', { namespace: 'dynamic-us' });
  }

  // Get realms for a region
  async getRealms(region: string = 'us'): Promise<BlizzardApiResponse<any>> {
    return this.get('/data/wow/realm/index', { 
      namespace: `dynamic-${region}`,
      locale: 'en_US' 
    });
  }
}
