
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // In a real multi-tenant app, you'd get the tenantId from the user's session.
  try {
    const tenant = await prisma.tenant.findFirst({
        where: { id: { not: 'system' }}
    });

    if (!tenant) {
        return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
        where: { tenantId: tenant.id }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
