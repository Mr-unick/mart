
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    const { user } = await verifyAuth();
    if (!user || user.tenantId === 'system') {
        // Or decide if vehicles can be cross-tenant. For now, scope them.
        return NextResponse.json([]);
    }

  try {
    const vehicles = await prisma.vehicle.findMany({
        where: { tenantId: user.tenantId }
    });
    return NextResponse.json(vehicles);
  } catch (error)
 {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
