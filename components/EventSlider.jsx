"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaClock, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import EventDate from "./EventDate";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function EventSlider({ events }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const formatRupiah = (num) => {
    if (num === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (!events || events.length === 0) return null;

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const activeEvent = events[activeIndex];

  return (
    <section className=" text-black">
      <div className="container mx-auto px-4 py-8 mb-12">
        <div className="flex justify-between">
          <h2 className="text-xl md:text-3xl font-bold mb-8">Event Terbaru</h2>
          <Link href={`/events`} className="flex items-center hover:text-primary gap-1">
            <h2 className="text-sm font-bold">Lihat Lebih banyak</h2>
            <MdOutlineArrowForwardIos className="w-3 h-3"/>
          </Link>
        </div>

        {/* Container utama */}
        <div className="relative max-w-8xl mx-auto flex gap-x-8  overflow-hidden justify-between">
          {/* Carousel area (2/3) */}
          <div className="relative flex-[2] h-[320px] shadow-lg">
            {events.map((item, i) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  i === activeIndex
                    ? "opacity-100 z-20"
                    : "opacity-0 z-10 pointer-events-none"
                }`}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-2xl z-10"
                    priority={i === activeIndex}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-l-lg z-10">
                    No Image
                  </div>
                )}
              </div>
            ))}

            {/* Tombol navigasi */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide sebelumnya"
              className="btn btn-circle absolute left-3 top-1/2 -translate-y-1/2  hover:bg-primary text-white z-30"
            >
              ❮
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide berikutnya"
              className="btn btn-circle absolute right-3 top-1/2 -translate-y-1/2  hover:bg-primary text-white z-30"
            >
              ❯
            </button>
          </div>

          {/* Deskripsi (1/3) */}
          <div className="flex-[1]  text-black p-6 h-[320px] overflow-auto ">
            <h3
              className="text-xl font-semibold truncate mb-4"
              title={activeEvent?.title}
            >
              {activeEvent?.title}
            </h3>

            <div className="flex items-center text-md mb-3">
              <FaTag className="mr-3 text-black" />
              <span>{formatRupiah(activeEvent?.price)}</span>
            </div>

            <div className="flex items-center text-md mb-3">
              <FaMapMarkerAlt className="mr-3 text-black" />
              <span className="truncate" title={activeEvent?.location}>
                {activeEvent?.location}
              </span>
            </div>

            <div className="flex items-center text-md mb-6">
              <FaClock className="mr-3 text-black" />
              <EventDate date={activeEvent?.date} />
            </div>

            <Link
              href={`/events/${activeEvent?.slug}/details`}
              className="text-white bg-primary   text-sm px-6 py-2 rounded-md  "
            >
              Detail
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
