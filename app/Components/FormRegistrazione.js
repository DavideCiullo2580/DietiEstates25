"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/posts/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/"); // Redirect dopo registrazione OK
      } else {
        setError(data.error || "Errore durante la registrazione");
      }
    } catch (err) {
      setError("Errore di connessione al server");
    }
  };

  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* La parte sinistra */}
      <div
        className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat px-8 py-16"
        style={{ backgroundImage: 'url("/immagine-registrati.png")' }}
      >
        <div className="absolute inset-0 bg-gray-800 opacity-70 z-0"></div>
        <div className="relative z-10 max-w-md text-center text-white space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Unisciti alla nostra comunità
          </h1>
          <p className="text-lg">
            Registrati su{" "}
            <span className="font-semibold text-blue-300">DietiEstates25</span>{" "}
            e scopri le migliori proprietà sul mercato.
          </p>
          <p className="text-md text-blue-200">
            Crea il tuo account in pochi semplici passaggi e inizia la tua
            ricerca.
          </p>
        </div>
      </div>

      {/* La parte destra */}
      <div
        id="registrazione"
        className="flex flex-col items-center justify-center px-6 py-16 bg-white shadow-xl"
      >
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Registrati
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="reg-name"
                className="block text-sm font-medium text-black mb-1"
              >
                Nome
              </label>
              <input
                type="text"
                id="reg-name"
                className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                placeholder="Inserisci il tuo nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="reg-email"
                className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="reg-password"
                className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                placeholder="Crea una password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-black font-semibold shadow rounded-md transition duration-200"
            >
              Registrati
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-green-600">{message}</p>
          )}
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}

          <div className="mt-8">
            <p className="text-center text-sm text-gray-500 mb-4">
              Oppure registrati con:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
             <button
                onClick={() => window.location.href = "/api/auth/signin/google"}
                className="flex-1 px-4 py-2 bg-white text-black border border-gray-300 rounded-md shadow hover:bg-gray-200">
                Google
              </button>

              <button className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-md shadow hover:bg-blue-900">
                Facebook
              </button>
              <button onClick={() => window.location.href = "/api/auth/signin/github"}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900">
              GitHub
            </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm">
            Hai già un account?{" "}
            <Link
              href="/"
              className="text-blue-600 hover:underline font-medium"
            >
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
