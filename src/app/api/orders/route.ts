
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import type { OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  // In a real multi-tenant app, you'd get the tenantId from the user's session.
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') as OrderStatus | null;

  try {
     const tenant = await prisma.tenant.findFirst({
        where: { id: { not: 'system' }}
    });
    
    if (!tenant) {
        return NextResponse.json([]);
    }
    
    const whereClause: { tenantId: string, status?: OrderStatus } = { tenantId: tenant.id };
    if (status) {
        whereClause.status = status;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
