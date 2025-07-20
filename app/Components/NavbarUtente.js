"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function NavbarUtente() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between min-h-[7rem] sm:min-h-[5rem]">
          <Link href="/" className="flex flex-col sm:flex-row items-center min-w-0">
            <Image
              src="/dietiestates25-logo.png"
              alt="DietiEstates25 Logo"
              width={180}
              height={50}
              className="block flex-shrink-0"
            />
    
          </Link>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-black hover:text-blue-600 focus:outline-none"
              aria-label="Apri menu"
            >
              {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 shadow-lg rounded-md py-2 z-50">
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
 