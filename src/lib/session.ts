'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User } from './definitions';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // console.error('JWT Verification Error:', error);
    return null;
  }
}

export async function createSession(user: Omit<User, 'password'>) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 1 day
  const session = await encrypt({ user, expires });

  cookies().set('session', session, { expires, httpOnly: true });
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  const decrypted = await decrypt(sessionCookie);
  if (!decrypted) return null;
  
  if (new Date(decrypted.expires) < new Date()) {
    return null;
  }

  return decrypted as { user: Omit<User, 'password'>; expires: string };
}

export async function deleteSession() {
  cookies().delete('session');
}
