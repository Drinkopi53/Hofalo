import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Heart } from "lucide-react";
import Link from "next/link";

export default async function PersembahanPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const offerings = await prisma.offering.findMany({
    orderBy: { date: "desc" },
    include: { congregation: true, createdBy: true },
  });

  const total = offerings.reduce((sum, o) => sum + o.amount, 0);

  const typeLabels: Record<string, string> = {
    PERSEPULUHAN: "Persepuluhan",
    PERSEMBAHAN_UMUM: "Persembahan Umum",
    PERSEMBAHAN_SYUKUR: "Persembahan Syukur",
    PERSEMBAHAN_KHUSUS: "Persembahan Khusus",
    LAINNYA: "Lainnya",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Persepuluhan & Persembahan</h1>
          <p className="text-sm sm:text-base text-gray-600">Catatan persembahan jemaat</p>
        </div>
        {((session.user as any)?.role === "KETUA" || (session.user as any)?.role === "STAFF") && (
          <Link
            href="/persembahan/tambah"
            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Persembahan
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-purple-50">
            <Heart className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Persembahan</p>
            <p className="text-xl font-semibold text-purple-600">{formatCurrency(total)}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jemaat</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dicatat Oleh</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offerings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Belum ada persembahan</td>
                </tr>
              ) : (
                offerings.map((offering) => (
                  <tr key={offering.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(offering.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{typeLabels[offering.type]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offering.congregation?.name || "Umum"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-purple-600">{formatCurrency(offering.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{offering.notes || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offering.createdBy.name}</td>
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
