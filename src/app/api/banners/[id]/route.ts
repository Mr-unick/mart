
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { user } = await verifyAuth();
    if (!user || user.tenantId === 'system') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, imageUrl, isActive } = body;

        const banner = await prisma.banner.findFirst({
            where: {
                id: params.id,
                tenantId: user.tenantId
            }
        });

        if (!banner) {
            return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
        }

        const updatedBanner = await prisma.banner.update({
            where: { id: params.id },
            data: {
                title,
                imageUrl,
                isActive
            }
        });

        return NextResponse.json(updatedBanner);
    } catch (error) {
        console.error(`Failed to update banner ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { user } = await verifyAuth();
    if (!user || user.tenantId === 'system') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const banner = await prisma.banner.findFirst({
            where: {
                id: params.id,
                tenantId: user.tenantId
            }
        });

        if (!banner) {
            return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
        }

        await prisma.banner.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Failed to delete banner ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
