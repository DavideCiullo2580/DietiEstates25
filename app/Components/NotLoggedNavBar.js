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
          {/* Logo a sinistra */}
          <Link href="/" className="flex items-center h-full">
            <Image
              src="/dietiestates25-logo.png"
              alt="DietiEstates25 Logo"
              width={180}
              height={50}
              className="block"
            />
          </Link>

          {/* Link per desktop */}
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
            <li>
              <Link
                href="/HomeAgenteImmobiliare"
                className="text-black hover:text-blue-600"
              >
                Agente
              </Link>
            </li>
            <li>
              <Link
                href="/HomeUtente"
                className="text-black hover:text-blue-600"
              >
                Utente
              </Link>
            </li>
          </ul>

          {/* Menu hamburger per mobile */}
          <button
            className="md:hidden text-black hover:text-blue-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Drawer menu mobile */}
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
            <li>
              <Link
                href="/HomeAmministratore"
                className="block text-black hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Accedi in amministratore(momentaneo)
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
