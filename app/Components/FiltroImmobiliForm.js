"use client";

export default function FiltroImmobiliForm() {
  return (
    <div className="mb-8 p-6 border border-gray-300 rounded shadow bg-gray-50">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">Tipologia</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option value="">Qualsiasi</option>
            <option value="vendita">Vendita</option>
            <option value="affitto">Affitto</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Prezzo Minimo (€)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Min"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Prezzo Massimo (€)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Max"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Numero Stanze</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Es: 3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Classe Energetica</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option value="">Qualsiasi</option>
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
          <label className="block font-semibold mb-1">Comune</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Inserisci comune"
          />
        </div>

        <div className="md:col-span-3 flex justify-end space-x-4 pt-4">
          <button
            type="reset"
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 transition"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
          >
            Applica Filtri
          </button>
        </div>
      </form>
    </div>
  );
}
