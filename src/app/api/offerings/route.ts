import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== "KETUA" && role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, amount, date, congregationId, notes } = body;

    const offering = await prisma.offering.create({
      data: {
        type,
        amount: parseFloat(amount),
        date: new Date(date),
        congregationId: congregationId || null,
        notes: notes || null,
        createdById: session.user.id as string,
      },
    });

    return NextResponse.json(offering);
  } catch (error) {
    console.error("Failed to create offering:", error);
    return NextResponse.json({ error: "Failed to create offering" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const offerings = await prisma.offering.findMany({
      orderBy: { date: "desc" },
      include: { congregation: true, createdBy: true },
    });
    return NextResponse.json(offerings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch offerings" }, { status: 500 });
  }
}
