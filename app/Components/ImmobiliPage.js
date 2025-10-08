"use client";
import { useEffect, useState } from "react";
import FiltroImmobiliForm from "./FiltroImmobiliForm";

export default function ListaImmobili({ onSelectImmobile, setImmobili, immobili }) {
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const [filtri, setFiltri] = useState({
    tipo_annuncio: "",
    tipo_immobile: "",
    prezzoMin: "",
    prezzoMax: "",
    stanzeMin: "",
    classeEnergetica: "",
    comune: "",
  });

  const fetchImmobili = async (filtriParam = filtri) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Utente non autenticato. Effettua il login.");
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams(filtriParam).toString();
      const res = await fetch(`http://localhost:8080/posts/immobili/azienda?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Errore nel caricamento immobili");

      const data = await res.json();
      setImmobili(data);
    } catch (err) {
      console.error("Errore:", err);
    } finally {
      setLoading(false);
    }
  };

  const aggiornaVisualizzazioni = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`http://localhost:8080/posts/immobili/${id}/aggiorna-visualizzazioni`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Errore aggiornamento visualizzazioni:", err);
    }
  };

  useEffect(() => {
    fetchImmobili();
  }, []);

  return (
    <div>
      {/* Titolo e pulsante filtri */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Immobili</h1>
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
        >
          {showFilter ? "Chiudi Filtri" : "Filtra"}
        </button>
      </div>

      {/* Form filtri */}
      {showFilter && (
        <FiltroImmobiliForm
          filtri={filtri}
          setFiltri={setFiltri}
          onApply={(f) => {
            setFiltri(f);
            fetchImmobili(f);
            setShowFilter(false);
          }}
        />
      )}

      {/* Stato caricamento */}
      {loading ? (
        <p className="text-center text-gray-500">Caricamento...</p>
      ) : immobili.length === 0 ? (
        <p className="text-center text-gray-500">Nessun immobile trovato</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {immobili.map((immobile) => (
            <div key={immobile.id} className="border rounded shadow p-4 bg-white">
              <img
                src={immobile.immagine_url || "/placeholder.jpg"}
                alt={`Immagine di ${immobile.tipo_immobile}`}
                className="w-full h-48 object-cover rounded mb-4"
              />

              <h2 className="text-xl font-semibold mb-2">{immobile.tipo_immobile}</h2>
              <p className="text-gray-700 mb-1">📍 {immobile.indirizzo}</p>
              <p className="text-gray-700 mb-1">💶 €{immobile.prezzo}</p>
              <p className="text-gray-700 mb-3">📐 {immobile.dimensioni} mq</p>

              <button
                onClick={() => {
                  aggiornaVisualizzazioni(immobile.id);
                  onSelectImmobile(immobile);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Visualizza dettagli
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
