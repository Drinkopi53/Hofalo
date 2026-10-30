import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Plus, Calculator } from "lucide-react";
import Link from "next/link";

export default async function AnggaranPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const budgets = await prisma.budget.findMany({
    orderBy: [{ year: "desc" }, { month: "asc" }],
  });

  const currentYear = new Date().getFullYear();
  const totalBudget = budgets
    .filter(b => b.year === currentYear)
    .reduce((sum, b) => sum + b.amount, 0);

  const months = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Anggaran</h1>
          <p className="text-sm sm:text-base text-gray-600">Perencanaan anggaran gereja</p>
        </div>
        {(session.user as any)?.role === "KETUA" && (
          <Link
            href="/anggaran/tambah"
            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Anggaran
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-lg bg-orange-50">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Anggaran Tahun {currentYear}</p>
            <p className="text-lg sm:text-xl font-semibold text-orange-600">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada anggaran</td>
                </tr>
              ) : (
                budgets.map((budget) => (
                  <tr key={budget.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.month ? months[budget.month] : "Tahunan"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-orange-600">{formatCurrency(budget.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{budget.description || "-"}</td>
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
