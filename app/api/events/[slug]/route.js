// app/api/events/[slug]/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const { slug } = params;

  // Validasi slug
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json(
      { error: 'Invalid slug' },
      { status: 400 }
    );
  }

  try {
    // Ambil event berdasarkan slug
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        tickets: true, // Jika ingin sertakan daftar tiket (optional)
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
