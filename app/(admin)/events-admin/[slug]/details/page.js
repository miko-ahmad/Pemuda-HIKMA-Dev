import prisma from "@/lib/prisma";
import { FormattedDate } from "@/components/FormattedDate"; // pastikan path sesuai struktur project kamu

export default async function EventDetail({ params }) {
  const { slug } = params;

  if (!slug) {
    return (
      <p className="text-center py-10 text-gray-500">Slug tidak ditemukan</p>
    );
  }

  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    return (
      <p className="text-center py-10 text-gray-500">Event tidak ditemukan</p>
    );
  }

  const eventDate = new Date(event.date);
  const formattedTime = eventDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Gambar Event */}
        {event.image && (
          <div className="h-64 md:h-96 w-full overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-6 py-6">
          {/* Judul */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {event.title}
          </h1>

          {/* Tanggal & Waktu */}
          <div className="text-gray-700 mb-2">
            <strong>Tanggal:</strong> <FormattedDate date={event.date} /> -{" "}
            {formattedTime} WIB
          </div>

          {/* Lokasi */}
          <div className="text-gray-700 mb-2">
            <strong>Lokasi:</strong> {event.location}
          </div>

          {/* Harga */}
          <div className="text-gray-700 mb-6">
            <strong>Harga:</strong>{" "}
            {event.price === 0
              ? "Gratis"
              : `Rp${event.price.toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`}
          </div>

          {/* Deskripsi */}
          <div
            className="prose prose-lg max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>
      </article>
    </main>
  );
}
