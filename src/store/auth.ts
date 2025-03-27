import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  name: string;
  email: string;
  isLoggedIn: boolean;
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  name: '',
  email: '',
  isLoggedIn: false,
  login: async (name, email) => {
    try {
      const response = await axios.post(
        'https://frontend-take-home-service.fetch.com/auth/login',
        { name, email },
        { withCredentials: true }
      );
      if (response.status === 200) {
        set({ name, email, isLoggedIn: true });
        return true;
      }
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
    return false;
  },
  logout: () => {
    set({ name: '', email: '', isLoggedIn: false });
  },
}));
