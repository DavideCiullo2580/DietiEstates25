"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import NavbarUtente from "../Components/NavbarUtente";
import Footer from "../Components/Footer";
import ListaImmobili from "../Components/ListaImmobiliUtente";
import ModaleDettagliImmobile from "../Components/ModaleDettagliImmobile";

const MappaImmobili = dynamic(() => import("../Components/MappaImmobili"), { ssr: false });

export default function HomeUtente() {
  const [immobili, setImmobili] = useState([]);
  const [immobileSelezionato, setImmobileSelezionato] = useState(null);


  const aggiornaVisualizzazioni = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://localhost:8080/posts/immobili/${id}/aggiorna-visualizzazioni`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Errore aggiornamento visualizzazioni:", err);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <NavbarUtente />

      <main className="flex-1 flex flex-col lg:flex-row">
        
        <div
          className="w-full lg:w-1/2 lg:h-[calc(100vh-5rem)] h-auto overflow-y-auto border-r border-gray-200 shadow-inner p-6 flex flex-col"
          style={{
            backgroundImage: 'url("/SfondoHome.png")',
            backgroundSize: "cover",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "white"
          }}
        >
          <ListaImmobili
            immobili={immobili}
            setImmobili={setImmobili}
            onSelectImmobile={(immobile) => {
              setImmobileSelezionato(immobile);
            }}
            aggiornaVisualizzazioni={aggiornaVisualizzazioni}
          />
        </div>

        <div className="w-full lg:w-1/2 bg-white shadow-lg overflow-hidden lg:sticky lg:top-[5rem] lg:h-[calc(100vh-5rem)] h-64">
          <MappaImmobili
            immobili={immobili}
            immobileSelezionato={immobileSelezionato}
            onSelectImmobile={(immobile) => {
              setImmobileSelezionato(immobile);
            }}
            aggiornaVisualizzazioni={aggiornaVisualizzazioni}
          />
        </div>
      </main>

      {immobileSelezionato && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg p-6 transition-all duration-300 ease-out scale-100">
            <ModaleDettagliImmobile
              immobile={immobileSelezionato}
              onClose={() => setImmobileSelezionato(null)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}