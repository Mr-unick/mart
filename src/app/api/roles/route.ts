
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  const { user } = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Super admins can see system roles, tenants see their own roles.
    const tenantId = user.tenantId === 'system' ? 'system' : user.tenantId;

    const roles = await prisma.role.findMany({
        where: { tenantId: tenantId }
    });
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
