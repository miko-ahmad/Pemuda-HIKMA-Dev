import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function EventDetail({ params }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug }
  })

  if (!event) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      
      <div className="flex items-center mb-6 text-gray-500">
        <span>{new Date(event.date).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>{event.location}</span>
      </div>
      
      <div className="relative h-64 w-full mb-6">
        <Image
          src={event.image || '/assets/default-event.jpg'}
          alt={event.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: event.description }} />
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Register for this event</h2>
        <p className="text-2xl font-bold text-blue-600 mb-4">Rp {event.price.toLocaleString()}</p>
        <Link 
          href={`/events/${event.slug}/payment`}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition inline-block"
        >
          Register Now
        </Link>
      </div>
    </div>
  )
}