
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
        const { name, description, defaultPrice, imageUrl, dataAiHint } = body;

        // Ensure the product belongs to the user's tenant before updating
        const product = await prisma.product.findFirst({
            where: {
                id: params.id,
                tenantId: user.tenantId
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: {
                name,
                description,
                defaultPrice: Number(defaultPrice),
                imageUrl,
                dataAiHint,
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error(`Failed to update product ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { user } = await verifyAuth();
    if (!user || user.tenantId === 'system') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const product = await prisma.product.findFirst({
            where: {
                id: params.id,
                tenantId: user.tenantId
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Failed to delete product ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
