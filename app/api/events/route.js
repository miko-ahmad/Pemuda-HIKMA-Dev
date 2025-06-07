import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// CREATE EVENT
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { title, slug, description, image, date, location, price } = data;

    // Validasi
    if (!title || !slug || !description || !date || !location || price === undefined) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Cek slug unik
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        image: image || null,
        date: new Date(date),
        location,
        price: parseFloat(price),
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Gagal membuat event:', error);
    return NextResponse.json({ message: 'Gagal membuat event: ' + error.message }, { status: 500 });
  }
}

// GET EVENT(S)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const event = await prisma.event.findUnique({
        where: { slug },
        include: { tickets: true },
      });

      if (!event) {
        return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
      }

      return NextResponse.json(event);
    } else {
      const events = await prisma.event.findMany({
        orderBy: { date: 'asc' },
        include: { tickets: true },
      });

      return NextResponse.json(events);
    }
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 });
  }
}

// UPDATE EVENT
export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ message: 'Slug dibutuhkan' }, { status: 400 });
    }

    const data = await request.json();

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
    }

    if (data.slug && data.slug !== slug) {
      const slugExists = await prisma.event.findUnique({ where: { slug: data.slug } });
      if (slugExists) {
        return NextResponse.json({ message: 'Slug baru sudah digunakan' }, { status: 400 });
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { slug },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image || null,
        date: new Date(data.date),
        location: data.location,
        price: parseFloat(data.price),
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update event' }, { status: 500 });
  }
}

// DELETE EVENT
export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ message: 'Slug dibutuhkan' }, { status: 400 });
    }

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
    }

    await prisma.event.delete({ where: { slug } });

    return NextResponse.json({ message: 'Event berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Gagal hapus event:', error);
    return NextResponse.json({ message: 'Gagal hapus event' }, { status: 500 });
  }
}
