export default function Login() {
  return (
    <>
      {/* Linea nera sopra il componente */}
      <div className="w-full border-t border-black" />

      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Colonna sinistra con sfondo e testo */}
        <div
          id="registrazione_azienda" className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat px-8 py-16"
          style={{ backgroundImage: 'url("/immagine-candidatura.jpg")' }}
        >
          <div className="absolute inset-0 bg-gray-800 opacity-50 z-0"></div>

          <div className="relative z-10 max-w-md text-center text-white space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Dai forma al futuro dell'immobiliare con noi.
            </h1>
            <p className="text-lg">
              Su <span className="font-semibold text-blue-300">DietiEstates25</span> cerchiamo professionisti ambiziosi e affidabili per espandere la nostra rete. Unisciti a un team dinamico e innovativo, dove la tua passione per l'immobiliare trova nuove opportunità.
            </p>
            <p className="text-md text-blue-200">
              Costruiamo insieme un servizio di eccellenza: trasparente, efficiente e orientato al successo reciproco.
            </p>
          </div>
        </div>

        {/* Colonna destra: login */}
        <div className="flex items-center justify-center px-6 py-16 bg-white shadow-xl">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Invia candidatura</h2>

            <form className="space-y-6">
              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-black mb-1">
                  Inserisci nome società
                </label>
                <input
                  type="text"
                  id="login-username"
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci il nome della società"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-black mb-1">
                  Inserisci Pec
                </label>
                <input
                  type="password"
                  id="login-password"
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci la tua pec"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-black mb-1">
                  Telefono
                </label>
                <input
                  type="password"
                  id="login-password"
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci il tuo recapito telefonico"
                />
              </div>

              {/* Bottone aggiornato */}
              <button
                type="submit"
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow transition duration-200"
              >
                Invia richiesta
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
