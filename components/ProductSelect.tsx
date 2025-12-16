import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Product } from '@/types';
import { Card, CardContent } from './ui/card';

interface ProductDropdownProps {
  products: Product[];
  selectedProductId: number | null;
  onProductChange: (value: number | null) => void;
  label?: string;
  showAllOption?: boolean;
}

export default function ProductSelect({ 
  products, 
  selectedProductId, 
  onProductChange, 
  label = 'Pilih Produk', 
  showAllOption = false 
}: ProductDropdownProps) {

  const noProducts = products.length === 0;

  return (
    <Card
      className="shadow-lg border-0 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(250, 248, 245, 0.95)',
        border: '1px solid rgba(123, 156, 199, 0.2)',
      }}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          <Label htmlFor="product-select">{label}</Label>

          {/* === Jika produk belum ada === */}
          {noProducts ? (
            <div className="p-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm font-medium">
              ⚠️ Belum ada produk yang tersedia. Silakan tambahkan produk terlebih dahulu.
            </div>
          ) : (
            <Select
              value={selectedProductId ? selectedProductId.toString() : ''}
              onValueChange={(value) => {
                if (value === 'all') {
                  onProductChange(null);
                } else {
                  onProductChange(Number(value));
                }
              }}
            >
              <SelectTrigger className="text-xl font-semibold" id="product-select">
                <SelectValue placeholder="Pilih produk..." />
              </SelectTrigger>

              <SelectContent>
                {showAllOption && <SelectItem value="all">📊 Semua Produk</SelectItem>}

                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
