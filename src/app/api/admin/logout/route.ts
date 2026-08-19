import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  // Optional: untrust device on explicit logout, but usually we just delete the session token
  return NextResponse.json({ success: true });
}
