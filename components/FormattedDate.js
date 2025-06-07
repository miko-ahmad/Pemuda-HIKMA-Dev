'use client';

export function FormattedDate({ date }) {
  const dt = new Date(date);

  const formatted = dt.toLocaleDateString('id-ID', {
    weekday: 'long',   // Jumat
    day: 'numeric',    // 7
    month: 'long',     // Juni
    year: 'numeric'    // 2025
  });

  return (<span>{formatted}</span>);
}
