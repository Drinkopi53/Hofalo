import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet } from "lucide-react";

export default async function KasPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [transactions, offerings] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { date: "desc" },
    }),
    prisma.offering.findMany({
      orderBy: { date: "desc" },
    }),
  ]);

  const pemasukan = transactions.filter(t => t.type === "PEMASUKAN").reduce((sum, t) => sum + t.amount, 0);
  const pengeluaran = transactions.filter(t => t.type === "PENGELUARAN").reduce((sum, t) => sum + t.amount, 0);
  const totalPersembahan = offerings.reduce((sum, o) => sum + o.amount, 0);
  const saldo = pemasukan - pengeluaran + totalPersembahan;

  return (
    <div className="w-full max-w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kas</h1>
        <p className="text-sm sm:text-base text-gray-600">Laporan saldo kas gereja</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-lg bg-blue-50">
            <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Saldo Kas Saat Ini</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(saldo)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-gray-600">Pemasukan</p>
          <p className="text-lg sm:text-xl font-semibold text-green-600">{formatCurrency(pemasukan)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-gray-600">Pengeluaran</p>
          <p className="text-lg sm:text-xl font-semibold text-red-600">{formatCurrency(pengeluaran)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-gray-600">Persembahan</p>
          <p className="text-lg sm:text-xl font-semibold text-purple-600">{formatCurrency(totalPersembahan)}</p>
        </div>
      </div>
    </div>
  );
}
