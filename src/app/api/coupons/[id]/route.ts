
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import type { CouponType } from '@prisma/client';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { user } = await verifyAuth();
    if (!user || user.tenantId === 'system') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { code, type, discount, isActive } = body;

        const coupon = await prisma.coupon.findFirst({
            where: {
                id: params.id,
                tenantId: user.tenantId
            }
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        const updatedCoupon = await prisma.coupon.update({
            where: { id: params.id },
            data: {
                code,
                type: type as CouponType,
                discount: Number(discount),
                isActive
            }
        });

        return NextResponse.json(updatedCoupon);
    } catch (error) {
        console.error(`Failed to update coupon ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { user } = await verifyAuth();
    if (!user || user.tenantId === 'system') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const coupon = await prisma.coupon.findFirst({
            where: {
                id: params.id,
                tenantId: user.tenantId
            }
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        await prisma.coupon.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Coupon deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Failed to delete coupon ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
