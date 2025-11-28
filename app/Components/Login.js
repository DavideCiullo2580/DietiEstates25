'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    try {
      const res = await fetch('http://localhost:8080/posts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Errore durante il login');
        setMessageType("error");
        return;
      }

      localStorage.setItem('token', data.token);

      const ruolo = data.role;

      switch (ruolo) {
        case 'utente':
          router.push('/HomeUtente');
          break;
        case 'amministratore':
          router.push('/HomeAmministratore');
          break;
        case 'gestore':
          router.push('/HomeGestore');
          break;
        case 'agente': 
          router.push('/HomeAgenteImmobiliare');
          break;
        default:
          router.push('/');
          break;
      }


    } catch (error) {
      setMessage('Errore di rete o server');
      setMessageType('error');    
    }
  };

  return (
    <>
      <div className="w-full border-t border-black" />

      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
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

        <div
          id="login"
          className="flex flex-col items-center justify-center px-6 py-16 bg-white shadow-xl"
        >
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Accedi</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Username o Nome dell'agenzia
                </label>
                <input
                  type="text"
                  id="login-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci il tuo username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci la tua password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow transition duration-200"
              >
                Accedi
              </button>
            </form>

            {message && (
              <p
                className={`mt-4 text-center font-semibold ${
                  messageType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-gray-600">
              Non hai un account?{' '}
              <a
                href="/signin#registrazione"
                className="text-blue-600 hover:underline font-medium"
              >
                Registrati
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
