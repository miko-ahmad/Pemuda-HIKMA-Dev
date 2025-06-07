'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function AdminNavbar() {
  const pathname = usePathname()

  const links = [
    { href: '/articles-admin', label: 'Articles' },
    { href: '/events-admin', label: 'Events' },
    { href: '/transaction', label: 'Transaction' },
    { href: '/', label: 'Back to Landing Page' },
  ]

  return (
    <aside className="w-64 bg-blue-900 text-white shadow-lg flex flex-col min-h-screen">
      <div className="p-4 border-b border-blue-800">
        <Link href="/dashboard" className="text-xl font-bold block hover:text-primary">
          Dashboard
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded transition-colors ${
              pathname.startsWith(link.href)
                ? 'bg-blue-800 font-bold'
                : 'hover:bg-blue-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full text-left px-4 py-2 rounded hover:bg-blue-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
