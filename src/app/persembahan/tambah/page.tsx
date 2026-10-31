"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const offeringTypes = [
  { value: "PERSEPULUHAN", label: "Persepuluhan" },
  { value: "PERSEMBAHAN_UMUM", label: "Persembahan Umum" },
  { value: "PERSEMBAHAN_SYUKUR", label: "Persembahan Syukur" },
  { value: "PERSEMBAHAN_KHUSUS", label: "Persembahan Khusus" },
  { value: "LAINNYA", label: "Lainnya" },
];

export default function TambahPersembahanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [congregations, setCongregations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    type: "PERSEMBAHAN_UMUM",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    congregationId: "",
    notes: "",
  });

  useEffect(() => {
    fetchCongregations();
  }, []);

  const fetchCongregations = async () => {
    try {
      const res = await fetch("/api/congregations");
      const data = await res.json();
      setCongregations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/offerings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (res.ok) {
        toast.success("Persembahan berhasil ditambahkan");
        router.push("/persembahan");
      } else {
        toast.error("Gagal menambahkan persembahan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/persembahan" className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Persembahan</h1>
        <p className="text-gray-600">Catat persepuluhan atau persembahan jemaat</p>
      </div>

      <div className="bg-white rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Persembahan</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
            >
              {offeringTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Rp)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jemaat (Opsional)</label>
            <select
              value={formData.congregationId}
              onChange={(e) => setFormData({ ...formData, congregationId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Umum</option>
              {congregations.map((congregation) => (
                <option key={congregation.id} value={congregation.id}>
                  {congregation.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <Link
              href="/persembahan"
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition text-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
