"use client";
import { useEffect, useState } from "react";
import FiltroImmobiliForm from "./FiltroImmobiliForm";

export default function ListaImmobili({ onSelectImmobile, setImmobili, immobili, aggiornaVisualizzazioni }) {
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

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
    setMessage(null);
    setMessageType(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Utente non autenticato. Effettua il login.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams(filtriParam).toString();
      const res = await fetch(`http://localhost:8080/posts/immobili/tutti?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Errore nel caricamento immobili");

      const data = await res.json();
      setImmobili(data);
    } catch (err) {
      console.error("Errore:", err);
      setMessage("Errore durante il caricamento degli immobili.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImmobili();
  }, []);

  return (
    <div>
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

        {message && (
        <p
          className={`mt-4 text-center font-semibold ${
            messageType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

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

              {/* Indicatori di vicinanza */}
              <div className="flex flex-wrap gap-2 mb-3">
                {immobile.vicino_scuole && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Vicino a scuole
                  </span>
                )}
                {immobile.vicino_parchi && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  🌳  Vicino a parchi
                  </span>
                )}
                {immobile.vicino_trasporti && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  🚌  Vicino a trasporto pubblico
                  </span>
                )}
              </div>

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
