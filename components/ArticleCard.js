import Link from 'next/link'
import Image from 'next/image'

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={article.image || '/assets/default-article.jpg'}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{article.title}</h3>
          <p className="text-gray-600 line-clamp-2">{article.content.substring(0, 100)}...</p>
          <div className="mt-4 text-sm text-gray-500">
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Link>
    </div>
  )
}