import Head from 'next/head';
import NotLoggedNavBar from '../Components/NotLoggedNavBar';

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/homepage-background.png")' }}
    >
      <Head>
        <title>Home - DietiEstates25</title>
        <meta name="description" content="Benvenuti su DietiEstates25, la vostra soluzione per la gestione di immobili." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <NotLoggedNavBar />

      <main className="relative z-10 text-white px-6">
        {/* Titolo al centro */}
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h1 className="text-5xl font-extrabold leading-tight">
            Benvenuti su <span className="text-blue-950">DietiEstates25</span>
          </h1>
          <p className="mt-4 text-xl">Trova la casa giusta per te.</p>
          <p className="mt-2 text-lg">Selezioniamo solo immobili che fanno la differenza.</p>
        </div>

        {/* Login + Registrazione più in basso */}
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LOGIN FORM */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Accedi</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="login-username"
                  className="mt-1 block w-full px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-blue-600"
                  placeholder="Inserisci il tuo username"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  className="mt-1 block w-full px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-blue-600"
                  placeholder="Inserisci la tua password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md"
              >
                Accedi
              </button>
            </form>
          </div>

          {/* REGISTRATION FORM */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Registrati</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-white">
                  Nome
                </label>
                <input
                  type="text"
                  id="reg-name"
                  className="mt-1 block w-full px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-blue-600"
                  placeholder="Inserisci il tuo nome"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="reg-email"
                  className="mt-1 block w-full px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-blue-600"
                  placeholder="Inserisci la tua email"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="reg-password"
                  className="mt-1 block w-full px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-blue-600"
                  placeholder="Crea una password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md"
              >
                Registrati
              </button>
            </form>

            {/* SOCIAL REGISTRATION */}
            <div className="mt-8">
              <p className="text-center text-sm text-gray-300 mb-4">Oppure registrati con:</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-200">
                  Google
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-md shadow hover:bg-blue-900">
                  Facebook
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900">
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
