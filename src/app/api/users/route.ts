
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  const { user } = await verifyAuth();
  if (!user || user.tenantId === 'system') {
    return NextResponse.json([]);
  }

  try {
    const users = await prisma.user.findMany({
        where: { tenantId: user.tenantId }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
