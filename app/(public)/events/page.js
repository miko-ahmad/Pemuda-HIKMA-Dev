import prisma from '@/lib/prisma'
import EventCard from '@/components/EventCard'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <p className="text-gray-500">No events scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}