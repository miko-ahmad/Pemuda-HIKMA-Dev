import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function ArticleDetail({ params }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug }
  })

  if (!article || !article.published) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      
      <div className="flex items-center mb-6 text-gray-500">
        <span>By {article.author.name}</span>
        <span className="mx-2">•</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="relative h-64 w-full mb-6">
        <Image
          src={article.image || '/assets/default-article.jpg'}
          alt={article.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  )
}