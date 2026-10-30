import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, Heart, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [totalPemasukan, totalPengeluaran, totalPersembahan, recentTransactions] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: "PEMASUKAN" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { type: "PENGELUARAN" },
      _sum: { amount: true },
    }),
    prisma.offering.aggregate({
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: { category: true },
    }),
  ]);

  const pemasukan = totalPemasukan._sum.amount || 0;
  const pengeluaran = totalPengeluaran._sum.amount || 0;
  const persembahan = totalPersembahan._sum.amount || 0;
  const saldo = pemasukan - pengeluaran;

  const stats = [
    {
      name: "Total Pemasukan",
      value: formatCurrency(pemasukan),
      icon: ArrowDownCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      name: "Total Pengeluaran",
      value: formatCurrency(pengeluaran),
      icon: ArrowUpCircle,
      color: "text-red-600 bg-red-50",
    },
    {
      name: "Saldo Kas",
      value: formatCurrency(saldo),
      icon: Wallet,
      color: "text-blue-600 bg-blue-50",
    },
    {
      name: "Persepuluhan & Persembahan",
      value: formatCurrency(persembahan),
      icon: Heart,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Selamat datang, {session.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                  <p className="text-base sm:text-xl font-semibold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transaksi Terbaru</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTransactions.length === 0 ? (
            <p className="px-6 py-4 text-gray-500 text-center">Belum ada transaksi</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === "PEMASUKAN" ? "bg-green-50" : "bg-red-50"
                  }`}>
                    {transaction.type === "PEMASUKAN" ? (
                      <ArrowDownCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.category?.name || "Tanpa Kategori"} • {new Date(transaction.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${
                  transaction.type === "PEMASUKAN" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "PEMASUKAN" ? "+" : "-"} {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
