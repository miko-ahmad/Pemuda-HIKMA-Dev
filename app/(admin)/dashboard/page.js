import prisma from '@/lib/prisma'

export default async function DashboardPage() {
   console.log('laoyut');
  const [articleCount, eventCount, ticketCount] = await Promise.all([
    prisma.article.count(),
    prisma.event.count(),
    prisma.ticket.count()
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Articles</h3>
          <p className="text-3xl font-bold">{articleCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold">{eventCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Tickets</h3>
          <p className="text-3xl font-bold">{ticketCount}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <p className="text-gray-500">No recent activities</p>
      </div>
    </div>
  )
}