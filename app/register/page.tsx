'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    if (password.length < 8 ) {
      setError('Password minimal 8 karakter');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/register', { username, password }, { withCredentials: true });

      alert(res.data.message || 'Registrasi berhasil');
      router.push('/login'); // redirect ke halaman login
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, #96C5E8 0%, #D8CFB6 50%`,
      }}
    >
      <div className="w-full max-w-md space-y-6 mb-14">
        <Card
          className="shadow-lg border-0 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(250, 248, 245, 0.95)',
            border: '1px solid rgba(123, 156, 199, 0.2)',
          }}
        >
          <CardHeader>
            <CardTitle className='text-center p-1'>Daftar Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Masukkan Username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Konfirmasi Password</Label>
                <div className="relative">
                  <Input id="confirm" type={showConfirmPassword ? 'text' : 'password'} placeholder="Masukkan Ulang Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={isLoading} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-[#00275A]" disabled={isLoading}>
                <UserPlus className="h-4 w-4 mr-2" />
                {isLoading ? 'Sedang Memproses...' : 'Daftar'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Sudah punya akun?{' '}
              <span onClick={() => router.push('/login')} className="text-[#F66802] hover:underline cursor-pointer ml-0.5">
                Login di sini
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
