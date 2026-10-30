"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function LaporanClient({
  session,
  type,
  month,
  year,
  transactions,
  offerings,
  pemasukan,
  pengeluaran,
  totalPersembahan,
}: any) {
  const router = useRouter();

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const handleFilterChange = (newType: string, newMonth: number, newYear: number) => {
    router.push(`/laporan?type=${newType}&month=${newMonth}&year=${newYear}`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const title = type === "bulanan" 
      ? `Laporan Keuangan - ${months[month-1]} ${year}`
      : `Laporan Keuangan Tahunan - ${year}`;
    
    doc.setFontSize(16);
    doc.text("Hofalo - Laporan Keuangan Gereja", 14, 15);
    doc.setFontSize(12);
    doc.text(title, 14, 25);
    
    doc.setFontSize(10);
    doc.text(`Pemasukan: ${formatCurrency(pemasukan)}`, 14, 35);
    doc.text(`Pengeluaran: ${formatCurrency(pengeluaran)}`, 14, 40);
    doc.text(`Saldo: ${formatCurrency(pemasukan - pengeluaran)}`, 14, 45);
    doc.text(`Persepuluhan & Persembahan: ${formatCurrency(totalPersembahan)}`, 14, 50);
    
    const tableData = transactions.map((t: any) => [
      formatDate(t.date),
      t.type === "PEMASUKAN" ? "Pemasukan" : "Pengeluaran",
      t.description,
      t.category?.name || "-",
      t.type === "PEMASUKAN" ? formatCurrency(t.amount) : `-${formatCurrency(t.amount)}`,
    ]);
    
    autoTable(doc, {
      head: [["Tanggal", "Tipe", "Deskripsi", "Kategori", "Jumlah"]],
      body: tableData,
      startY: 60,
    });
    
    doc.save(`Laporan_${type}_${year}${month ? '_' + month : ''}.pdf`);
  };

  const exportExcel = () => {
    const data = transactions.map((t: any) => ({
      Tanggal: formatDate(t.date),
      Tipe: t.type === "PEMASUKAN" ? "Pemasukan" : "Pengeluaran",
      Deskripsi: t.description,
      Kategori: t.category?.name || "-",
      Jumlah: t.amount,
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
    
    // Add summary
    const summary = [
      { Keterangan: "Total Pemasukan", Jumlah: pemasukan },
      { Keterangan: "Total Pengeluaran", Jumlah: pengeluaran },
      { Keterangan: "Saldo", Jumlah: pemasukan - pengeluaran },
      { Keterangan: "Total Persembahan", Jumlah: totalPersembahan },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");
    
    XLSX.writeFile(wb, `Laporan_${type}_${year}${month ? '_' + month : ''}.xlsx`);
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-sm sm:text-base text-gray-600">Laporan bulanan, tahunan, dan kas keluar/masuk</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={exportPDF}
            className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <Download className="h-5 w-5 mr-2" />
            Export PDF
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-stretch sm:items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Laporan</label>
            <select
              value={type}
              onChange={(e) => handleFilterChange(e.target.value, month, year)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
            >
              <option value="bulanan">Bulanan</option>
              <option value="tahunan">Tahunan</option>
              <option value="kas">Kas Keluar/Masuk</option>
            </select>
          </div>
          {type === "bulanan" && (
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
              <select
                value={month}
                onChange={(e) => handleFilterChange(type, parseInt(e.target.value), year)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
          )}
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select
              value={year}
              onChange={(e) => handleFilterChange(type, month, parseInt(e.target.value))}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-gray-600">Pemasukan</p>
          <p className="text-lg sm:text-xl font-semibold text-green-600">{formatCurrency(pemasukan)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-gray-600">Pengeluaran</p>
          <p className="text-lg sm:text-xl font-semibold text-red-600">{formatCurrency(pengeluaran)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-gray-600">Saldo</p>
          <p className="text-lg sm:text-xl font-semibold text-blue-600">{formatCurrency(pemasukan - pengeluaran)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-gray-600">Persembahan</p>
          <p className="text-lg sm:text-xl font-semibold text-purple-600">{formatCurrency(totalPersembahan)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden w-full max-w-full">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {type === "bulanan" ? `Transaksi ${months[month-1]} ${year}` : type === "tahunan" ? `Transaksi Tahun ${year}` : "Kas Keluar/Masuk"}
          </h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Tidak ada transaksi</td>
                </tr>
              ) : (
                transactions.map((transaction: any) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(transaction.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.type === "PEMASUKAN" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {transaction.type === "PEMASUKAN" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category?.name || "-"}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                      transaction.type === "PEMASUKAN" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "PEMASUKAN" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
