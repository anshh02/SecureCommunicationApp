import { API_BASE_URL } from './config';
import { TokenStorage } from './tokenStorage';

// API service functions for authentication
export class AuthAPI {
  
  // Login function
  static async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        success: true,
        message: data.message,
        token_type: data.token_type,
        access_token: data.access_token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  // Registration function
  static async register(username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return {
        success: true,
        message: data.message,
        token_type: data.token_type,
        access_token: data.access_token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  // Get current user profile
  static async getCurrentUser() {
    try {
      const token = await TokenStorage.getToken();
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to get user profile');

      // Persist user snapshot (optional)
      await TokenStorage.setToken(token, data);

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message || 'Network error occurred' };
    }
  }

  // Logout function to clear stored tokens
  static async logout() {
    const ok = await TokenStorage.deleteToken();
    return ok
      ? { success: true, message: 'Logged out successfully' }
      : { success: false, error: 'Failed to clear auth data' };
  }
}