
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // In a real multi-tenant app, you'd get the tenantId from the user's session.
  try {
    const tenant = await prisma.tenant.findFirst({
        where: { id: { not: 'system' }}
    });

    const whereClause = tenant ? { tenantId: tenant.id } : { tenantId: 'system' };

    const roles = await prisma.role.findMany({
        where: whereClause
    });
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
