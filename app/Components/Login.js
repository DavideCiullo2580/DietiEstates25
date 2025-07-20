"use client";

import Link from 'next/link';

export default function Login() {
  return (
    <>
      {/* Linea nera sopra il componente */}
      <div className="w-full border-t border-black" />

      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Colonna sinistra con sfondo e testo */}
        <div
          className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat px-8 py-16"
          style={{ backgroundImage: 'url("/immagine-accedi.jpg")' }}
        >
          <div className="absolute inset-0 bg-gray-800 opacity-70 z-0"></div>

          <div className="relative z-10 max-w-md text-center text-white space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Trova la casa dei tuoi sogni
            </h1>
            <p className="text-lg">
              Su <span className="font-semibold text-blue-300">DietiEstates25</span> selezioniamo solo immobili di qualità, per offrirti un’esperienza abitativa unica.
            </p>
            <p className="text-md text-blue-200">
              Scopri un nuovo modo di cercare casa: semplice, affidabile, trasparente.
            </p>
          </div>
        </div>

        {/* Colonna destra: login */}
        <div id="login" className="flex flex-col items-center justify-center px-6 py-16 bg-white shadow-xl">

          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Accedi</h2>

            <form className="space-y-6">
              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-black mb-1">
                  Username o Nome dell'agenzia
                </label>
                <input
                  type="text"
                  id="login-username"
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci il tuo username"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci la tua password"
                />
              </div>

              {/* Bottone aggiornato */}
              <button
                type="submit"
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow transition duration-200"
              >
                Accedi
              </button>
            </form>

            {/* Testo sotto il form */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Non hai un account?{' '}
              <Link href="/signin#registrazione" className="text-blue-600 hover:underline font-medium">
                Registrati
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
