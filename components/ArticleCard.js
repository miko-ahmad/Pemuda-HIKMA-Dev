import Link from "next/link";
import Image from "next/image";
import { FormattedDate } from "@/components/FormattedDate";

export default function ArticleCard({ article }) {
  console.log(article);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* <Link href={`/articles/${article.slug}`}> */}
      <div className="relative h-48 w-full">
        <Image
          src={article.image || "/assets/default-article.jpg"}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{article.title}</h3>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Rilis baru:{" "}
              <time dateTime={new Date(article.createdAt).toISOString()}>
                <FormattedDate date={article.createdAt} />
              </time>
            </p>

            {/* <p className="text-blue-600 font-bold">Rp {article.price.toLocaleString()}</p> */}
          </div>

          <Link
            href={`/events/${article.slug}/details`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Detail
          </Link>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
}
