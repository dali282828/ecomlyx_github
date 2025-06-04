import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // For development, always return success
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 