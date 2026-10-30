import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download } from "lucide-react";
import LaporanClient from "./LaporanClient";

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: { type?: string; month?: string; year?: string };
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const type = searchParams.type || "bulanan";
  const month = parseInt(searchParams.month || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.year || String(new Date().getFullYear()));

  let transactions = [];
  let offerings = [];
  let startDate, endDate;

  if (type === "bulanan") {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 0, 23, 59, 59);
  } else if (type === "tahunan") {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31, 23, 59, 59);
  } else {
    startDate = new Date(0);
    endDate = new Date();
  }

  [transactions, offerings] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { category: true, createdBy: true },
      orderBy: { date: "asc" },
    }),
    prisma.offering.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { congregation: true },
      orderBy: { date: "asc" },
    }),
  ]);

  const pemasukan = transactions.filter(t => t.type === "PEMASUKAN").reduce((sum, t) => sum + t.amount, 0);
  const pengeluaran = transactions.filter(t => t.type === "PENGELUARAN").reduce((sum, t) => sum + t.amount, 0);
  const totalPersembahan = offerings.reduce((sum, o) => sum + o.amount, 0);

  return (
    <LaporanClient
      session={session}
      type={type}
      month={month}
      year={year}
      transactions={transactions}
      offerings={offerings}
      pemasukan={pemasukan}
      pengeluaran={pengeluaran}
      totalPersembahan={totalPersembahan}
    />
  );
}
