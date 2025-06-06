// Buat komponen format tanggal yang konsisten
'use client';

export function FormattedDate({ date }) {
  // Format tanggal di client sesuai locale browser
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  return <span>{formattedDate}</span>;
}