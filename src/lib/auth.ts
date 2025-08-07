
'use server'

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { redirect } from 'next/navigation';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-dev';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Token expires in 1 hour
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This could be due to an expired or invalid token
    return null;
  }
}

export async function login({ email, password }: { email: string, password?: string }) {
  // In a real app, you would hash and compare the password
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  // Create the session
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set('session', session, { expires, httpOnly: true });

  const redirectTo = user.role.name === 'Super Admin' ? '/super-admin/tenants' : '/products';

  return { success: true, redirectTo };
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/');
}

export async function verifyAuth() {
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return { user: null };
  }

  const session = await decrypt(sessionCookie);

  if (!session?.user) {
    return { user: null };
  }
  
  // Re-fetch user from DB to ensure data is fresh and session is still valid
  const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: { include: { permissions: true } } }
  });

  return { user };
}
