import Link from 'next/link'
import Image from 'next/image'

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link href={`/events/${event.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={event.image || '/assets/default-event.jpg'}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-gray-600 line-clamp-2">{event.description.substring(0, 100)}...</p>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()} • {event.location}
              </p>
              <p className="text-blue-600 font-bold">Rp {event.price.toLocaleString()}</p>
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Detail
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}