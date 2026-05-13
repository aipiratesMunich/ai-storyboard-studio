import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const correct = process.env.AUTH_PASSWORD;

  if (!correct) {
    return NextResponse.json({ error: 'AUTH_PASSWORD not configured' }, { status: 500 });
  }

  if (password === correct) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
