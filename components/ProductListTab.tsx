'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { Product } from '@/types';

interface ProductListTabProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export function ProductListTab({ products, setProducts }: ProductListTabProps) {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    kode: '',
    name: '',
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products');
      setProducts(res.data);
    } catch (err) {
      alert('Gagal mengambil daftar produk');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =============================
  // Tambah produk
  // =============================
  const handleAddProduct = async () => {
    if (!formData.name.trim()) return alert('Nama produk wajib diisi');

    try {
      await axios.post('http://localhost:5000/products', {
        kode: formData.kode,
        name: formData.name,
      });

      setFormData({ kode: '', name: '' });
      fetchProducts();
      setIsAddingProduct(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menambahkan produk');
    }
  };

  // =============================
  // Edit produk
  // =============================
  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setFormData({ kode: product.kode, name: product.name });
  };

  const handleSaveEdit = async (id: number) => {
    if (!formData.name.trim()) return alert('Nama produk wajib diisi');

    try {
      const res = await axios.put(`http://localhost:5000/products/${id}`, {
        kode: formData.kode,
        name: formData.name,
      });

      const updated = products.map((p) => (p.id === id ? res.data : p));

      setProducts(updated);
      setEditingId(null);
      setFormData({ kode: '', name: '' });
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal memperbarui produk');
    }
  };

  // =============================
  // Hapus produk
  // =============================
  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm('Hapus produk ini?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus produk');
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingId(null);
    setFormData({ kode: '', name: '' });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="p-6 rounded-xl flex justify-between items-center shadow-lg" style={{ backgroundColor: 'rgba(250, 248, 245, 0.9)' }}>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daftar Produk</h2>
          <p className="text-gray-600 text-sm">Total: {products.length} produk</p>
        </div>

        {!isAddingProduct && editingId === null && (
          <Button onClick={() => setIsAddingProduct(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-[#00275A] hover:bg-[#011d43]">
            <Plus className="h-5 w-5" />
            Tambah Produk
          </Button>
        )}
      </div>

      {/* FORM TAMBAH / EDIT */}
      {(isAddingProduct || editingId !== null) && (
        <div className="p-6 rounded-xl shadow-lg space-y-4" style={{ backgroundColor: 'rgba(250, 248, 245, 0.9)' }}>
          <h3 className="text-lg font-semibold text-gray-800">{isAddingProduct ? 'Tambah Produk Baru' : 'Edit Produk'}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Produk</label>
            <input
              type="text"
              placeholder="Masukkan kode produk"
              value={formData.kode}
              onChange={(e) => setFormData((prev) => ({ ...prev, kode: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#e0e0e0' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
            <input
              type="text"
              placeholder="Masukkan nama produk"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#e0e0e0' }}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button onClick={handleCancel} className="px-4 py-2 rounded-lg font-medium bg-[#F66802] text-white hover:shadow-lg hover:bg-[#DA4E00] transition-all duration-200">
              <X className="h-4 w-4" />
              Batal
            </Button>

            <Button onClick={() => (isAddingProduct ? handleAddProduct() : handleSaveEdit(editingId!))} className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-[#00275A] hover:bg-[#011d43]">
              <Check className="h-4 w-4" />
              {isAddingProduct ? 'Tambah Produk' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      )}

      {/* DAFTAR PRODUK */}
      {products.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: 'rgba(250, 248, 245, 0.9)' }}>
          <p className="text-gray-500 text-lg">Tidak ada produk. Klik tombol "Tambah Produk" untuk memulai.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product, index) => (
            <Card key={product.id} className="p-4 rounded-xl shadow-lg transition-all hover:shadow-xl" style={{ backgroundColor: 'rgba(250, 248, 245, 0.9)', borderColor: '#e8ddd4' }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-white rounded-full px-3 py-1 bg-[#00275A]">{index + 1}</span>
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 ml-11">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg border border-[#F66802] text-sm font-semibold" style={{ backgroundColor: '#F66802', color: 'white' }}>
                      Kode: {product.kode || 'N/A'}
                    </span>
                    <p className="text-xs text-gray-500">Dibuat: {product.created_at ? new Date(product.created_at).toLocaleDateString('id-ID') : '-'}</p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 ml-4">
                  <Button onClick={() => handleEditProduct(product)} className="p-2 rounded-lg transition-all" style={{ backgroundColor: '#e8ddd4', color: '#4a4a4a' }} title="Edit produk">
                    <Edit2 className="h-5 w-5" />
                  </Button>

                  <Button onClick={() => handleDeleteProduct(product.id)} className="p-2 rounded-lg transition-all" style={{ backgroundColor: '#f8d7da', color: '#721c24' }} title="Hapus produk">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
