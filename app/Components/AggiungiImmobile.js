"use client";

import Head from "next/head";

export default function AggiungiImmobile() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/SfondoHome.png")' }}
    >
      <Head>
        <title>Aggiungi Immobile - DietiEstates25</title>
        <meta name="description" content="Aggiungi un nuovo immobile su DietiEstates25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <main className="relative z-10 px-6 py-12 text-white">
        <div className="max-w-3xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-xl text-black">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Aggiungi Immobile</h1>

          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Tipo di Annuncio</label>
              <select className="w-full p-2 border border-gray-300">
                <option value="">Seleziona</option>
                <option value="vendita">Vendita</option>
                <option value="affitto">Affitto</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Tipo di Immobile</label>
              <select className="w-full p-2 border border-gray-300">
                <option value="">Seleziona</option>
                <option>Appartamento</option>
                <option>Villa</option>
                <option>Villetta a schiera</option>
                <option>Attico</option>
                <option>Loft</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1">Prezzo (€)</label>
                <input type="number" className="w-full p-2 border border-gray-300" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Dimensioni (mq)</label>
                <input type="number" className="w-full p-2 border border-gray-300" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Stanze</label>
                <input type="number" className="w-full p-2 border border-gray-300" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Piano</label>
                <input type="number" className="w-full p-2 border border-gray-300" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Indirizzo</label>
              <input type="text" className="w-full p-2 border border-gray-300" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Classe Energetica</label>
              <select className="w-full p-2 border border-gray-300">
                <option value="">Seleziona</option>
                <option>A+</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>F</option>
                <option>G</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Foto dell’Immobile</label>
              <input type="file" multiple accept="image/*" className="w-full p-2 border border-gray-300" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Descrizione</label>
              <textarea className="w-full p-2 border border-gray-300" rows="4" />
            </div>

            <div>
              <label className="block font-semibold mb-2">Servizi Inclusi</label>
              <div className="grid grid-cols-2 gap-2">
                {["Portineria", "Ascensore", "Giardino", "Climatizzazione", "Posto Auto"].map((servizio) => (
                  <label key={servizio} className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span>{servizio}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-900 hover:bg-blue-700 text-white font-semibold rounded"
              >
                Aggiungi Immobile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
