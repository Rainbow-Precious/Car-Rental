import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create a base axios instance
const api = axios.create({
  baseURL: 'http://159.65.31.191/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the headers
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If it's a 401 Unauthorized error and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Handle token refresh here if you have a refresh token endpoint
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post('/auth/refresh-token', { refreshToken });
        // localStorage.setItem('authToken', response.data.token);
        
        // For now, just redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/signin';
        return Promise.reject(error);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/signin';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Utility functions for common API operations
export const apiService = {
  // Campus API
  createCampus: (data: { 
    name: string, 
    description?: string,
    address: string,
    city: string,
    state: string,
    country: string,
    phoneNumber: string,
    email?: string,
    capacity: number
  }) => {
    return api.post('/Tenant/setup/campus', data);
  },
  
  // Class API
  createClass: (data: { name: string, campusId: string, description?: string }) => {
    return api.post('/Tenant/setup/class', data);
  },
  
  // Arm API
  createArm: (data: { name: string, description?: string, classId: string }) => {
    return api.post('/Tenant/setup/arm', data);
  },
  
  // Setup Status API
  getSetupStatus: () => {
    return api.get('/Tenant/setup-status');
  },
  
  // Setup Progress API
  getSetupProgress: () => {
    return api.get('/Tenant/setup/progress');
  },
  
  // Auth API
  login: (data: { email: string, password: string }) => {
    return api.post('/Tenant/login', data);
  },
  
  // Password Reset API
  forgotPassword: (data: { email: string }) => {
    return api.post('/Password/forgot-password', data);
  },
  
  validateResetToken: (data: { token: string }) => {
    return api.post('/Password/validate-reset-token', data);
  },
  
  resetPassword: (data: { token: string, email: string, newPassword: string }) => {
    return api.post('/Password/reset-password', data);
  },
  
  // Verification API
  verifyEmail: (data: { email: string, otpCode: string }) => {
    return api.post('/Tenant/verify-email', data);
  },
  
  resendVerificationOtp: (data: { email: string }) => {
    return api.post('/Tenant/resend-verification-otp', data);
  }
};

export default api; 