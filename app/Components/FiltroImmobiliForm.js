"use client";
import { useState, useEffect } from "react";

export default function FiltroImmobiliForm({ filtri, setFiltri, onApply }) {
    const [localFiltri, setLocalFiltri] = useState({
    tipo_annuncio: "", 
    tipo_immobile: "",
    prezzoMin: "",
    prezzoMax: "",
    stanzeMin: "",
    classeEnergetica: "",
    comune: "",
  });

  useEffect(() => {
    setLocalFiltri({
      tipo_annuncio: filtri.tipo_annuncio || "",
      tipo_immobile: filtri.tipo_immobile || "",
      prezzoMin: filtri.prezzoMin || "",
      prezzoMax: filtri.prezzoMax || "",
      stanzeMin: filtri.stanzeMin || "",
      classeEnergetica: filtri.classeEnergetica || "",
      comune: filtri.comune || "",
    });
  }, [filtri]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFiltri((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(localFiltri);
  };

  const handleReset = () => {
    const empty = {
      tipo_annuncio: "",
      tipo_immobile: "",
      prezzoMin: "",
      prezzoMax: "",
      stanzeMin: "",
      classeEnergetica: "",
      comune: "",
    };
    setLocalFiltri(empty);
    onApply(empty);
  };

  return (
    <div className="mb-8 p-6 border border-gray-300 rounded shadow bg-gray-50">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit} onReset={handleReset}>
    <div>
      <label className="block font-semibold mb-1">Tipo Annuncio</label>
      <select
        name="tipo_annuncio"
        value={localFiltri.tipo_annuncio}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Qualsiasi</option>
        <option value="vendita">Vendita</option>
        <option value="affitto">Affitto</option>
      </select>
    </div>

    <div>
      <label className="block font-semibold mb-1">Tipo Immobile</label>
      <select
        name="tipo_immobile"
        value={localFiltri.tipo_immobile}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Qualsiasi</option>
        <option value="Appartamento">Appartamento</option>
        <option value="Villa">Villa</option>
        <option value="Villetta a schiera">Villetta a schiera</option>
        <option value="Attico">Attico</option>
        <option value="Loft">Loft</option>
      </select>
    </div>


        <div>
          <label className="block font-semibold mb-1">Prezzo Minimo (€)</label>
          <input
            type="number"
            name="prezzoMin"
            value={localFiltri.prezzoMin}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Min"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Prezzo Massimo (€)</label>
          <input
            type="number"
            name="prezzoMax"
            value={localFiltri.prezzoMax}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Max"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Numero Stanze</label>
          <input
            type="number"
            name="stanzeMin"
            value={localFiltri.stanzeMin}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Es: 3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Classe Energetica</label>
          <select
            name="classeEnergetica"
            value={localFiltri.classeEnergetica}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
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
            name="comune"
            value={localFiltri.comune}
            onChange={handleChange}
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