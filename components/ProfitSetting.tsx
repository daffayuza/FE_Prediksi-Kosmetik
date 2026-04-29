'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';

export default function ProfitSetting() {
  const [profit, setProfit] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch profit saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchProfit = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/profit', { withCredentials: true });
        setProfit(res.data.profit_per_unit);
        setInputValue(res.data.profit_per_unit.toString());
      } catch (err) {
        console.error(err);
        alert('Gagal mengambil data laba per unit');
      } finally {
        setLoading(false);
      }
    };

    fetchProfit();
  }, []);

  // Update profit ke backend
  const handleSave = async () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert('Masukkan angka yang valid!');
      return;
    }

    try {
      setSaving(true);
      const res = await axios.post('http://localhost:5000/profit', { profit_per_unit: parseFloat(inputValue) }, { withCredentials: true });
      setProfit(res.data.profit_per_unit);
      alert('Laba per unit berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan laba per unit');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      className="shadow-lg border-0 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(250, 248, 245, 0.95)',
        border: '1px solid rgba(123, 156, 199, 0.2)',
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Laba per Unit Barang (Rp)</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat data laba per unit...
          </div>
        ) : (
          <div className="flex items-center space-x-5 w-2/4">
            <Input id="profit" type="number" placeholder="Masukkan laba per unit" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#00275A] hover:bg-[#011d43]">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Simpan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
