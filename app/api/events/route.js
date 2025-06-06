import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const slug = searchParams.get('slug')
  
  if (id) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { tickets: true }
    })
    
    if (!event) {
      return Response.json({ message: 'Event not found' }, { status: 404 })
    }
    
    return Response.json(event)
  }
  
  if (slug) {
    const event = await prisma.event.findUnique({
      where: { slug }
    })
    
    if (!event) {
      return Response.json({ message: 'Event not found' }, { status: 404 })
    }
    
    return Response.json(event)
  }
  
  const events = await prisma.event.findMany()
  return Response.json(events)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }
  
  const { title, slug, description, image, date, location, price } = await request.json()
  
  try {
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        image,
        date: new Date(date),
        location,
        price
      }
    })
    
    return Response.json(event)
  } catch (error) {
    return Response.json({ message: 'Failed to create event' }, { status: 500 })
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }
  
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return Response.json({ message: 'ID is required' }, { status: 400 })
  }
  
  const { title, slug, description, image, date, location, price } = await request.json()
  
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        image,
        date: new Date(date),
        location,
        price
      }
    })
    
    return Response.json(event)
  } catch (error) {
    return Response.json({ message: 'Failed to update event' }, { status: 500 })
  }
}