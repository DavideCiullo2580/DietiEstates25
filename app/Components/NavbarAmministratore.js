import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function NotLoggedNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [azienda, setAzienda] = useState("Caricamento...");

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token"); // o dove salvi il token
        if (!token) {
          setAzienda("Ospite");
          return;
        }

        // Fai una chiamata al backend per ottenere i dati utente, compresa l'azienda
        const res = await fetch("http://localhost:8080/posts/NomeAzienda", { 
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Errore nel recupero dati utente");

        const user = await res.json();
        setAzienda(user.azienda || "Azienda non definita");
      } catch (error) {
        console.error(error);
        setAzienda("Errore nel caricamento");
      }
    }

    fetchUser();
  }, []);

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
            <span className="mt-2 sm:mt-0 sm:ml-4 text-xl font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis sm:max-w-[300px] text-center sm:text-left">
              {azienda}
            </span>
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
                  href="/HomeAmministratore"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/AggiungiMembro"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Aggiungi Membro
                </Link>
                <Link
                  href="/CambiaPasswordAmministratore"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Cambia password
                </Link>
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
