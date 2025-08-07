
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import type { OrderStatus } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { user } = await verifyAuth();
  if (!user || user.tenantId === 'system') {
    return NextResponse.json([]);
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') as OrderStatus | null;

  try {
    const whereClause: { tenantId: string, status?: OrderStatus } = { tenantId: user.tenantId };
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
