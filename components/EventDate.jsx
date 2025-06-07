'use client';
import { FormattedDate } from '@/components/FormattedDate';

export default function EventDate({ date }) {
  const isPast = new Date(date) < new Date();

  if (isPast) {
    return <span className="text-red-600 font-semibold">Event Berakhir</span>;
  }

  return <FormattedDate date={date} />;
}
