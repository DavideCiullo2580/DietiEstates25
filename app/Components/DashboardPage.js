"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [immobili, setImmobili] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImmobili() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/posts/DashboardImmobili", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        setImmobili(data.immobili || []);
      } catch (err) {
        console.error("Errore nel recupero immobili:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchImmobili();
  }, []);

  const badgeColor = (views) => {
    if (views < 100) return "bg-green-200 text-green-800";
    if (views < 500) return "bg-yellow-200 text-yellow-800";
    return "bg-red-200 text-red-800";
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-8 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/SfondoHome.png")' }}>
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-950">Dashboard Immobili</h1>

      {loading ? (
        <p className="text-center text-gray-600">Caricamento immobili...</p>
      ) : immobili.length === 0 ? (
        <p className="text-center text-gray-600">Nessun immobile da visualizzare.</p>
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {immobili.map((immobile) => (
            <div key={immobile.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              
              {/* Immagine compatta */}
              <div className="w-full h-48">
                <img
                  src={immobile.immagine_url || "/placeholder.png"}
                  alt={immobile.tipo_immobile || "Immobile"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dati immobile in due colonne */}
              <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-2">
                <h2 className="col-span-2 text-xl font-semibold text-blue-950 flex justify-between items-center">
                  {immobile.tipo_immobile || "Tipologia non specificata"}
                  <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${badgeColor(immobile.visualizzazioni)}`}>
                    {immobile.visualizzazioni.toLocaleString("it-IT")}
                  </span>
                </h2>
                <p><strong>Prezzo:</strong> € {Number(immobile.prezzo || 0).toLocaleString("it-IT")}</p>
                <p><strong>Dimensioni:</strong> {immobile.dimensioni || "N/D"} m²</p>
                <p><strong>Stanze:</strong> {immobile.stanze || "N/D"}</p>
                <p><strong>Piano:</strong> {immobile.piano || "N/D"}</p>
                <p><strong>Classe Energetica:</strong> {immobile.classe_energetica || "N/D"}</p>
                <p className="col-span-2"><strong>Indirizzo:</strong> {immobile.indirizzo || "N/D"}</p>
                <p className="col-span-2"><strong>Comune:</strong> {immobile.comune || "N/D"}</p>
                <p className="col-span-2"><strong>Descrizione:</strong> {immobile.descrizione || "N/D"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
