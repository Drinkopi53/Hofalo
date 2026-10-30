import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";

export default async function TransaksiPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: { category: true, createdBy: true },
  });

  const totalPemasukan = transactions
    .filter(t => t.type === "PEMASUKAN")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPengeluaran = transactions
    .filter(t => t.type === "PENGELUARAN")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pemasukan & Pengeluaran</h1>
          <p className="text-sm sm:text-base text-gray-600">Catatan transaksi keuangan gereja</p>
        </div>
        {((session.user as any)?.role === "KETUA" || (session.user as any)?.role === "STAFF") && (
          <Link
            href="/transaksi/tambah"
            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Transaksi
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-green-50">
              <ArrowDownCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Pemasukan</p>
              <p className="text-lg sm:text-xl font-semibold text-green-600">{formatCurrency(totalPemasukan)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-lg bg-red-50">
              <ArrowUpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Pengeluaran</p>
              <p className="text-lg sm:text-xl font-semibold text-red-600">{formatCurrency(totalPengeluaran)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dicatat Oleh</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Belum ada transaksi</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.createdBy.name}</td>
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
