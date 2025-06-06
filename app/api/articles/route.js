// api/articles/route.js
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';



export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    console.log('Received article data:', data); // Debug log

    // Validasi data
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { message: 'Judul, slug, dan konten harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah slug sudah ada
    const existingArticle = await prisma.article.findUnique({
      where: { slug: data.slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { message: 'Slug sudah digunakan' },
        { status: 400 }
      );
    }

    // Buat artikel baru
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        image: data.image || null,
        published: data.published || false,
        author: {
          connect: { email: session.user.email }, // Hubungkan dengan author
        },
      },
      include: {
        author: true, // Sertakan data author dalam response
      },
    });

    console.log('Article created:', article); // Debug log

    return NextResponse.json(article, { status: 201 });

  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { message: 'Gagal membuat artikel: ' + error.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      // Cari 1 artikel berdasar slug
      const article = await prisma.article.findUnique({
        where: { slug },
      });

      if (!article) {
        return NextResponse.json(
          { message: 'Article not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(article);
    } else {
      // Get all articles
      const articles = await prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(articles);
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { message: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }

    // Optional: Cek kalau slug baru sudah ada di article lain
    if (data.slug && data.slug !== slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { message: 'Slug sudah digunakan artikel lain' },
          { status: 400 }
        );
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        image: data.image,
        published: data.published,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { message: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Cek apakah artikel ada
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }

    // Hapus artikel
    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { message: 'Failed to delete article' },
      { status: 500 }
    );
  }
}