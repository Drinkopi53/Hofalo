import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "KETUA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { year, month, category, amount, description } = body;

    const budget = await prisma.budget.create({
      data: {
        year: parseInt(year),
        month: month ? parseInt(month) : null,
        category,
        amount: parseFloat(amount),
        description: description || null,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Anggaran untuk kategori dan periode ini sudah ada" },
        { status: 409 }
      );
    }
    console.error("Failed to create budget:", error);
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      orderBy: [{ year: "desc" }, { month: "asc" }],
    });
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}
