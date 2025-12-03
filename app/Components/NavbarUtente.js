"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import ModaleLogout from "../Components/ModaleLogout";

export default function NavbarUtente() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");

    setShowLogoutModal(false);
    setMenuOpen(false);

    window.location.href = "/";
  }


  return (
  <>
    <nav className="bg-white border-b border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between min-h-[7rem] sm:min-h-[5rem]">
          <a className="flex flex-col sm:flex-row items-center min-w-0">
            <Image
              src="/dietiestates25-logo.png"
              alt="DietiEstates25 Logo"
              width={180}
              height={50}
              className="h-12 w-auto"
            />
          </a>

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

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>


    <ModaleLogout
      visible={showLogoutModal}
      onConfirm={handleLogout}
      onCancel={() => setShowLogoutModal(false)}
    />
  </>
);
}
 