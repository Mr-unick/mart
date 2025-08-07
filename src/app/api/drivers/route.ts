
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  const { user } = await verifyAuth();
  if (!user || user.tenantId === 'system') {
    return NextResponse.json([]);
  }

  try {
    const drivers = await prisma.user.findMany({
      where: {
        tenantId: user.tenantId,
        role: {
          name: 'Driver'
        }
      }
    });
    return NextResponse.json(drivers.map(d => ({id: d.id, name: d.name})));
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
