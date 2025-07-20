"use client";

import { useState } from "react";
import FiltroImmobiliForm from "./FiltroImmobiliForm";

export default function ImmobiliVicini() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-white lg:bg-gray-100 px-4 py-10"
      style={{ backgroundImage: 'url("/SfondoHome.png")' }}
    >
      <div className="lg:max-w-6xl lg:mx-auto lg:bg-white lg:p-8 lg:rounded-lg lg:shadow-md">
        <h1 className="text-center text-3xl font-bold mb-4 text-blue-900">
          Immobili Vicini a Te
        </h1>

        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
          >
            {showFilter ? "Chiudi Filtri" : "Filtra"}
          </button>
        </div>

        {showFilter && <FiltroImmobiliForm />}

        {/* Griglia per immobili (vuota, pronta per il DB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {/* Card immobili dinamiche qui in futuro */}
        </div>
      </div>
    </div>
  );
}
