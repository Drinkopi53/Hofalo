import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "KETUA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, nik, address, phone, birthDate, gender } = body;

    const congregation = await prisma.congregation.create({
      data: {
        name,
        nik: nik || null,
        address: address || null,
        phone: phone || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
      },
    });

    return NextResponse.json(congregation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create congregation" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const congregations = await prisma.congregation.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(congregations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch congregations" }, { status: 500 });
  }
}
