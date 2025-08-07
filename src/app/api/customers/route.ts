
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // In a real multi-tenant app, you'd get the tenantId from the user's session.
  // For now, we'll hardcode it to the first tenant that is not the 'system' tenant.
  try {
    const tenant = await prisma.tenant.findFirst({
        where: { id: { not: 'system' }}
    });
    
    if (!tenant) {
        return NextResponse.json([]);
    }

    const customers = await prisma.customer.findMany({
        where: { tenantId: tenant.id }
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
