"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const links = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
  ];

  if (status === "authenticated") {
    links.push({ href: "/dashboard", label: "Dashboard" });
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 text-black">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo-hikma-white.png"
            alt="Pemuda Hikma Logo"
            width={100}
            height={40}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-primary ${
                pathname === link.href ? "text-primary font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          ) : status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
