// app/api/articles/[slug]/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req, { params }) {
  const { slug } = params

  // Validasi slug
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json(
      { error: 'Invalid slug' },
      { status: 400 }
    )
  }

  try {
    // Ambil artikel berdasarkan slug
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article by slug:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
