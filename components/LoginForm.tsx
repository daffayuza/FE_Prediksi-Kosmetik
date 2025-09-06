'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn, TrendingUp } from 'lucide-react';
import type { LoginCredentials } from '@/types/auth';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function LoginForm({ onLogin, isLoading }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onLogin(credentials);
    if (!result.success) {
      setError(result.error || 'Login gagal');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, #7B9CC7 0%, #c7b9d4 50%, #e8ddd4 100%)`,
      }}
    >
      <div className="w-full max-w-md space-y-6 mb-14">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sistem Prediksi</h1>
          </div>
          <p className="text-gray-600">Masuk untuk mengakses sistem prediksi penjualan</p>
        </div>

        <Card
          className="shadow-lg border-0 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(250, 248, 245, 0.95)',
            border: '1px solid rgba(123, 156, 199, 0.2)',
          }}
        >
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Masukkan username dan password anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Input id="username" type="text" placeholder="Masukkan Username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    disabled={isLoading}
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? 'Sedang Login...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
