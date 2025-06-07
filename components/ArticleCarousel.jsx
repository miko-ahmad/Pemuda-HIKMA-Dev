import Image from "next/image";
import { FormattedDate } from "@/components/FormattedDate";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Link from "next/link";

export default function ArticleCarousel({ article }) {
  if (!Array.isArray(article) || article.length === 0) return null;

  const mainArticle = article[0];
  const sideArticles = article.slice(1);

  return (
    <section className="container mx-auto px-4 py-8 mb-12 text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
        <Link
          href="/articles"
          className="flex items-center hover:text-primary gap-1"
        >
          <h2 className="text-sm font-bold">Lihat Lebih Banyak</h2>
          <MdOutlineArrowForwardIos className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Article */}
        <div className="flex-1">
          <div className="relative w-full aspect-[12/6] rounded-xl overflow-hidden">
            {mainArticle.image && (
              <Image
                src={mainArticle.image}
                alt={mainArticle.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          <h3 className="mt-4 text-2xl font-bold text-[#0f1b49]">
            {mainArticle.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex gap-2 items-center">
            <span>🕒</span>
            {mainArticle.createdAt && (
              <time dateTime={new Date(mainArticle.createdAt).toISOString()}>
                <FormattedDate date={mainArticle.createdAt} />
              </time>
            )}
            <span className="ml-2">📍 Pusat Pemberitaan</span>
          </p>
        </div>

        {/* Side Articles */}
        <div className="lg:w-[430px] space-y-6">
          {sideArticles.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-32 h-24 sm:w-36 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={144}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0f1b49] leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 flex flex-col">
                  <span className="flex items-center gap-1">
                    🕒{" "}
                    {item.createdAt && (
                      <time dateTime={new Date(item.createdAt).toISOString()}>
                        <FormattedDate date={item.createdAt} />
                      </time>
                    )}
                  </span>
                  <span className="flex items-center gap-1">📍 Pusat Pemberitaan</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
