import EventTable from '@/components/EventTable'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link 
          href="/events-admin/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          New Event
        </Link>
      </div>
      
     <EventTable events={events} />
    </div>
  )
}