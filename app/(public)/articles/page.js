import prisma from '@/lib/prisma'
import ArticleCard from '@/components/ArticleCard'


export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Articles</h1>
      {articles.length === 0 ? (
        <p className="text-gray-500">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      
    </div>
  )
}