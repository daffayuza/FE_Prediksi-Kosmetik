// utils/excel.ts
import * as XLSX from 'xlsx';
import type { DataPoint } from '@/types';

export const processExcelFile = (
  file: File,
  isTraining: boolean,
  onSuccess: (data: DataPoint[], message: string) => void,
  onError: (error: string) => void
) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const mappedData: DataPoint[] = (jsonData as any[]).map((row, index) => ({
        id: index + 1,
        visitors: Number(row.pengunjung),
        pageViews: Number(row.tayangan),
        orders: Number(row.pesanan),
        unitsSold: Number(row.terjual),
      }));

      const hasInvalid = mappedData.some((d) =>
        isNaN(d.visitors) || isNaN(d.pageViews) || isNaN(d.orders) || isNaN(d.unitsSold)
      );

      if (hasInvalid) {
        onError('Pastikan semua kolom berisi angka: pengunjung, tayangan, pesanan, dan terjual.');
        return;
      }

      onSuccess(mappedData, `Berhasil membaca ${mappedData.length} baris dari file Excel.`);
    } catch (error) {
      onError('Gagal memproses file Excel.');
    }
  };

  reader.readAsBinaryString(file);
};
