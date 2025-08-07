
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // This is a simplified version. In a real app, you might have a dedicated Driver model.
  // For now, let's assume any user with a "Driver" role is a driver.
  try {
    const drivers = await prisma.user.findMany({
      where: {
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
