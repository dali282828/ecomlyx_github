import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // For development, always return available
    return NextResponse.json({ available: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 