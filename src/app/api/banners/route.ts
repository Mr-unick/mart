
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  const { user } = await verifyAuth();
  if (!user || user.tenantId === 'system') {
    return NextResponse.json([]);
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const onlyActive = searchParams.get('active') === 'true';

  try {
    const findOptions: any = {
      where: { 
        tenantId: user.tenantId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    };

    if (onlyActive) {
      findOptions.where.isActive = true;
    }
    
    if (limit) {
      findOptions.take = parseInt(limit);
    }

    const banners = await prisma.banner.findMany(findOptions);
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Failed to fetch banners:", error);
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
        const { title, imageUrl, isActive } = body;
        
        const newBanner = await prisma.banner.create({
            data: {
                title,
                imageUrl,
                isActive,
                tenantId: user.tenantId,
            }
        });

        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        console.error('Failed to create banner:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
