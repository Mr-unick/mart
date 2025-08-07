
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import type { CouponType } from '@prisma/client';

export async function GET() {
  const { user } = await verifyAuth();
  if (!user || user.tenantId === 'system') {
    return NextResponse.json([]);
  }
  try {
    const coupons = await prisma.coupon.findMany({
      where: { tenantId: user.tenantId }
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    const { user } = await verifyAuth();
    if (!user || user.tenantId === 'system') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { code, type, discount, isActive } = body;
        
        const newCoupon = await prisma.coupon.create({
            data: {
                code,
                type: type as CouponType,
                discount: Number(discount),
                isActive,
                tenantId: user.tenantId,
            }
        });

        return NextResponse.json(newCoupon, { status: 201 });
    } catch (error) {
        console.error('Failed to create coupon:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
