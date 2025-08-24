'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LoginForm } from '@/components/LoginForm';
import type { LoginCredentials } from '@/types/auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/login', credentials, { withCredentials: true });

      if (res.status === 200) {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/'); // redirect ke halaman utama
        return { success: true };
      }

      // kalau status bukan 200, tetap return gagal
      return { success: false, error: 'Login gagal' };
    } catch (err: any) {
      if (err.response) {
        return { success: false, error: err.response.data.error || 'Login gagal' };
      } else {
        return { success: false, error: 'Terjadi kesalahan server' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginForm onLogin={handleLogin} isLoading={isLoading} />;
}
