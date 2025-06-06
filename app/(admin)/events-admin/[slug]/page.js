import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function EventDetail({ params }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      tickets: true
    }
  })

  if (!event) {
    return notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{event.title}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <span className="text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-500">{event.location}</span>
        </div>
        
        {event.image && (
          <div className="relative h-64 w-full mb-6">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: event.description }} />
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Price</h3>
          <p className="text-2xl font-bold text-blue-600">Rp {event.price.toLocaleString()}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Tickets ({event.tickets.length})</h3>
          
          {event.tickets.length === 0 ? (
            <p className="text-gray-500">No tickets sold yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {event.tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.buyerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{ticket.buyerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{ticket.buyerPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}