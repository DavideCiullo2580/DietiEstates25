"use client";

import { useState } from "react";
import Head from "next/head";

export default function AggiungiImmobile() {
  const [tipoAnnuncio, setTipoAnnuncio] = useState("");
  const [tipoImmobile, setTipoImmobile] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [dimensioni, setDimensioni] = useState("");
  const [stanze, setStanze] = useState("");
  const [piano, setPiano] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [comune, setComune] = useState("");
  const [classeEnergetica, setClasseEnergetica] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [servizi, setServizi] = useState([]);
  const [files, setFiles] = useState([]);

  const [message, setMessage] = useState("");   
  const [messageType, setMessageType] = useState("");

  const serviziList = ["Portineria", "Ascensore", "Giardino", "Climatizzazione", "Posto Auto"];

const showMessage = (text, type = "success", duration = 3000) => {
  setMessage(text);
  setMessageType(type);

  setTimeout(() => {
    setMessage("");
    setMessageType("");
  }, duration);
};


  const handleServiziChange = (servizio) => {
    setServizi(prev => {
      if (prev.includes(servizio)) {
        return prev.filter(s => s !== servizio);
      } else {
        return [...prev, servizio];
      }
    });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    showMessage("Utente non autenticato. Effettua il login.");
    return;
  }

  const formData = new FormData();
  formData.append("tipoAnnuncio", tipoAnnuncio);
  formData.append("tipoImmobile", tipoImmobile);
  formData.append("prezzo", prezzo);
  formData.append("dimensioni", dimensioni);
  formData.append("stanze", stanze);
  formData.append("piano", piano);
  formData.append("indirizzo", indirizzo);
  formData.append("classeEnergetica", classeEnergetica);
  formData.append("descrizione", descrizione);
  formData.append("comune", comune);

  const serviziArray = servizi;
  formData.append("servizi", JSON.stringify(serviziArray));

  for (let i = 0; i < files.length; i++) {
    formData.append("immagini", files[i]);
  }


  try {
    const res = await fetch("http://localhost:8080/posts/immobili", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      showMessage(result.message || "Immobile aggiunto con successo", "success");


      setTipoAnnuncio("");
      setTipoImmobile("");
      setPrezzo("");
      setDimensioni("");
      setStanze("");
      setPiano("");
      setIndirizzo("");
      setComune("");
      setClasseEnergetica("");
      setDescrizione("");
      setServizi([]);
      setFiles([]);

    } else {

    showMessage(result.message || "Errore nell'aggiunta dell'immobile", "error");

    }
  } catch (error) {
    console.error(error);
    showMessage("Errore di connessione", "error");

  }
};

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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-1">Tipo di Annuncio</label>
              <select
                className="w-full p-2 border border-gray-300"
                value={tipoAnnuncio}
                onChange={(e) => setTipoAnnuncio(e.target.value)}
                required
              >
                <option value="">Seleziona</option>
                <option value="vendita">Vendita</option>
                <option value="affitto">Affitto</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Tipo di Immobile</label>
              <select
                className="w-full p-2 border border-gray-300"
                value={tipoImmobile}
                onChange={(e) => setTipoImmobile(e.target.value)}
                required
              >
                <option value="">Seleziona</option>
                <option value="Appartamento">Appartamento</option>
                <option value="Villa">Villa</option>
                <option value="Villetta a schiera">Villetta a schiera</option>
                <option value="Attico">Attico</option>
                <option value="Loft">Loft</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1">Prezzo (€)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full p-2 border border-gray-300"
                  value={prezzo}
                  onChange={(e) => setPrezzo(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Dimensioni (mq)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full p-2 border border-gray-300"
                  value={dimensioni}
                  onChange={(e) => setDimensioni(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Stanze</label>
                <input
                  type="number"
                  min={0}
                  className="w-full p-2 border border-gray-300"
                  value={stanze}
                  onChange={(e) => setStanze(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Piano</label>
                <input
                  type="number"
                  min={0}
                  className="w-full p-2 border border-gray-300"
                  value={piano}
                  onChange={(e) => setPiano(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Indirizzo</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300"
                value={indirizzo}
                onChange={(e) => setIndirizzo(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Comune</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300"
                value={comune}
                onChange={(e) => setComune(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Classe Energetica</label>
              <select
                className="w-full p-2 border border-gray-300"
                value={classeEnergetica}
                onChange={(e) => setClasseEnergetica(e.target.value)}
                required
              >
                <option value="">Seleziona</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Foto dell’Immobile</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full p-2 border border-gray-300"
                onChange={handleFileChange}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Descrizione</label>
              <textarea
                className="w-full p-2 border border-gray-300"
                rows="4"
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Servizi Inclusi</label>
              <div className="grid grid-cols-2 gap-2">
                {serviziList.map((servizio) => (
                  <label key={servizio} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={servizi.includes(servizio)}
                      onChange={() => handleServiziChange(servizio)}
                    />
                    <span>{servizio}</span>
                  </label>
                ))}
              </div>
              {message && (
               <div 
              className={`my-4 p-3 rounded ${messageType === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {message}
          </div>
          )}
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
