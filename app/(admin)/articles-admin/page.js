
import prisma from "@/lib/prisma";
import Link from "next/link";
import ArticlesTable from "@/components/ArticlesTable";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });



  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link
          href="/articles-admin/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          New Article
        </Link>
      </div>
    <ArticlesTable  articles={articles}/>
      
    </div>
  );
}


