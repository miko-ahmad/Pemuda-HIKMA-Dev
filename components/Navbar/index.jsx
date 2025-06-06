'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/articles', label: 'Articles' },
    { href: '/events', label: 'Events' },
  ]

  if (status === 'authenticated') {
    links.push({ href: '/dashboard', label: 'Dashboard' })
  }

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/images/logo-hikma-white.png" 
            alt="Pemuda Hikma Logo" 
            width={40} 
            height={40} 
          />
          <span className="text-xl font-bold">Pemuda Hikma</span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`hover:text-blue-200 ${pathname === link.href ? 'font-bold border-b-2 border-white' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Tombol Login / Logout / Loading */}
        {status === 'loading' ? (
          <button
            disabled
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md font-medium cursor-not-allowed"
          >
            Loading...
          </button>
        ) : status === 'authenticated' ? (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition"
          >
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  )
}
