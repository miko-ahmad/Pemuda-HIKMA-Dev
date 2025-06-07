import prisma from '@/lib/prisma'
import ArticleCard from '@/components/ArticleCard'
import EventCard from '@/components/EventCard'
import ArticleCarousel from '@/components/ArticleCarousel';
import EventSlider from '@/components/EventSlider';

export default async function Home() {

  const [articles, events] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      // take: 3
    }),
    prisma.event.findMany({
      orderBy: { date: 'asc' },
      // take: 3
    })
  ])

  return (
    <div className="">
      
     
  
        <ArticleCarousel  article={articles}/>
        <EventSlider events={events}/>
     
      {/* <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section> */}
      
      <section className="container mx-auto px-4 py-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div> */}
      </section>
    </div>
  )
}