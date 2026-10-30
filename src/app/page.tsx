import Link from "next/link";
import { Church, DollarSign, FileText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Church className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Hofalo</span>
            </div>
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistem Pencatatan Keuangan Gereja
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Kelola keuangan gereja dengan mudah, transparan, dan akuntabel. Catat pemasukan, pengeluaran, persembahan, dan laporan keuangan dalam satu platform.
          </p>
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition inline-block"
          >
            Mulai Sekarang
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <DollarSign className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Pemasukan & Pengeluaran</h3>
            <p className="text-gray-700">Catat semua transaksi keuangan gereja dengan kategori yang terorganisir</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <FileText className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Laporan Lengkap</h3>
            <p className="text-gray-700">Laporan bulanan, tahunan, dan kas masuk/keluar siap diunduh</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Users className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Data Jemaat</h3>
            <p className="text-gray-700">Kelola data jemaat dan pencatatan persepuluhan/persembahan</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Church className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Manajemen Anggaran</h3>
            <p className="text-gray-700">Rencanakan dan pantau anggaran gereja secara efektif</p>
          </div>
        </div>
      </main>
    </div>
  );
}
