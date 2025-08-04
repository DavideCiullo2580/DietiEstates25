"use client";

import { useEffect, useState } from "react";

export default function ImmobiliPage() {
  const [immobili, setImmobili] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImmobili = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Utente non autenticato");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/posts/immobili/miei", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Errore nel caricamento degli immobili");
        }

        const data = await res.json();
        setImmobili(data);
      } catch (error) {
        console.error("Errore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImmobili();
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-white lg:bg-gray-100 px-4 py-10"
      style={{ backgroundImage: 'url("/SfondoHome.png")' }}
    >
      <div className="lg:max-w-6xl lg:mx-auto lg:bg-white lg:p-8 lg:rounded-lg lg:shadow-md">
        <h1 className="text-center text-3xl font-bold mb-8">I TUOI IMMOBILI</h1>

        {loading ? (
          <p className="text-center text-gray-500">Caricamento...</p>
        ) : immobili.length === 0 ? (
          <p className="text-center text-gray-500">Nessun immobile trovato</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {immobili.map((immobile) => (
              <div key={immobile.id} className="border rounded shadow p-4">
              <img
                src={immobile.immagine_url || "/placeholder.jpg"}
                alt={`Immagine di ${immobile.tipo_immobile}`}
                className="w-full h-48 object-cover rounded mb-4"
              />


                <h2 className="text-xl font-semibold mb-2">{immobile.tipo_immobile}</h2>
                <p className="text-gray-700 mb-1">📍 {immobile.indirizzo}</p>
                <p className="text-gray-700 mb-1">💶 €{immobile.prezzo}</p>
                <p className="text-gray-700">📐 {immobile.dimensioni} mq</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
