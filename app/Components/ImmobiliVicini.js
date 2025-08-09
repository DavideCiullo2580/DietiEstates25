import { useEffect, useState } from "react";
import FiltroImmobiliForm from "./FiltroImmobiliForm";

export default function ImmobiliVicini() {
  const [immobili, setImmobili] = useState([]);
  const [loading, setLoading] = useState(true);
  const [immobileSelezionato, setImmobileSelezionato] = useState(null);
  const [showFilter, setShowFilter] = useState(false);


  const [filtri, setFiltri] = useState({
    tipoImmobili: "",
    prezzoMin: "",
    prezzoMax: "",
    stanzeMin: "",
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

      const queryParams = new URLSearchParams({
        tipo_annuncio: filtriParam.tipo_annuncio || "",
        tipo_immobile: filtriParam.tipo_immobile || "",
        prezzoMin: filtriParam.prezzoMin || "",
        prezzoMax: filtriParam.prezzoMax || "",
        stanzeMin: filtriParam.stanzeMin || "",
        classeEnergetica: filtriParam.classeEnergetica || "",
        comune: filtriParam.comune || "",
      }).toString();


      const res = await fetch(`http://localhost:8080/posts/immobili?${queryParams}`, {
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

  useEffect(() => {
    fetchImmobili();
  }, []);

const aggiornaVisualizzazioni = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Devi essere autenticato per visualizzare i dettagli");
      return;
    }

    const res = await fetch(`http://localhost:8080/posts/immobili/${id}/aggiorna-visualizzazioni`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
console.log('Status:', res.status);
const data = await res.json();
console.log('Response data:', data);

    if (!res.ok) {
      throw new Error("Errore nell'aggiornamento delle visualizzazioni");
    }
  } catch (error) {
    console.error(error);
  }
};


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

        {loading ? (
          <p className="text-center text-gray-500">Caricamento...</p>
        ) : immobili.length === 0 ? (
          <p className="text-center text-gray-500">Nessun immobile trovato</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {immobili.map((immobile) => (
              <div
                key={immobile.id}
                className="border rounded shadow p-4 bg-white"
              >
                <img
                  src={immobile.immagine_url || "/placeholder.jpg"}
                  alt={`Immagine di ${immobile.tipo_immobile}`}
                  className="w-full h-48 object-cover rounded mb-4"
                />

                <h2 className="text-xl font-semibold mb-2">
                  {immobile.tipo_immobile}
                </h2>
                <p className="text-gray-700 mb-1">📍 {immobile.indirizzo}</p>
                <p className="text-gray-700 mb-1">💶 €{immobile.prezzo}</p>
                <p className="text-gray-700 mb-3">
                  📐 {immobile.dimensioni} mq
                </p>

                <button
                  onClick={() => {
                    aggiornaVisualizzazioni(immobile.id);
                    setImmobileSelezionato(immobile); 
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

      {/* Modale dettagli */}
      {immobileSelezionato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">
            <button
              onClick={() => setImmobileSelezionato(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>

            <img
              src={immobileSelezionato.immagine_url || "/placeholder.jpg"}
              alt="Immagine immobile"
              className="w-full h-64 object-cover rounded mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              {immobileSelezionato.tipo_immobile}
            </h2>
            <p>
              <strong>📍 Indirizzo:</strong> {immobileSelezionato.indirizzo}
            </p>
            <p>
              <strong>💶 Prezzo:</strong> €{immobileSelezionato.prezzo}
            </p>
            <p>
              <strong>📐 Dimensioni:</strong> {immobileSelezionato.dimensioni} mq
            </p>
            <p>
              <strong>🛏️ Stanze:</strong> {immobileSelezionato.stanze}
            </p>
            <p>
              <strong>🏢 Piano:</strong> {immobileSelezionato.piano}
            </p>
            <p>
              <strong>⚡ Classe energetica:</strong>{" "}
              {immobileSelezionato.classe_energetica}
            </p>
            <p>
              <strong>📝 Descrizione:</strong> {immobileSelezionato.descrizione}
            </p>
            <p>
              <strong>🛠 Servizi:</strong>{" "}
              {immobileSelezionato.servizi?.join(", ") || "Nessuno"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
