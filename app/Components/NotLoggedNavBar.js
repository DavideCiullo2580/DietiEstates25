"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function NotLoggedNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-black sticky top-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <a className="flex items-center h-full">
            <Image
              src="/dietiestates25-logo.png"
              alt="DietiEstates25 Logo"
              width={180}
              height={50}
              className="h-12 w-auto"
            />
          </a>

          <ul className="hidden md:flex space-x-6">
            <li>
          <Link href="/" scroll={true} className="text-black hover:text-blue-600">
            Accedi
          </Link>
            </li>
            <li>
              <Link href="/signin" scroll={true} className="text-black hover:text-blue-600">
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/SigninRequest" scroll={true} 
                className="text-black hover:text-blue-600"
              >
                Collaborate With Us
              </Link>
            </li>
          </ul>

          <button
            className="md:hidden text-black hover:text-blue-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-black shadow-md">
          <ul className="flex flex-col space-y-2 px-4 py-4">
            <li>
              <Link
                href="/#accedi"
                className="block text-black hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signin#registrazione"
                className="block text-black hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/SigninRequest#registrazione_azienda"
                className="block text-black hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Collaborate With Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
