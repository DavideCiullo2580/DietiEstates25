"use client";
import { useState } from "react";
import NavbarUtente from "../Components/NavbarUtente";
import Footer from "../Components/Footer";
import ListaImmobili from "../Components/ListaImmobili";
import MappaImmobili from "../Components/MappaImmobili";
import ModaleDettagliImmobile from "../Components/ModaleDettagliImmobile";

export default function ImmobiliPage() {
  const [immobili, setImmobili] = useState([]);
  const [immobileSelezionato, setImmobileSelezionato] = useState(null);

  return (
    <>
      <NavbarUtente />

      <div className="px-4 py-10 lg:max-w-7xl lg:mx-auto lg:flex lg:gap-6">
        <div className="lg:w-1/2 h-[80vh] overflow-y-auto">
          <ListaImmobili
            immobili={immobili}
            setImmobili={setImmobili}
            onSelectImmobile={setImmobileSelezionato}
          />
        </div>

        <div className="lg:w-1/2 h-[80vh] sticky top-0">
          <MappaImmobili
            immobili={immobili}
            immobileSelezionato={immobileSelezionato}
            onSelectImmobile={setImmobileSelezionato}
          />
        </div>
      </div>
      
      {immobileSelezionato && (
        <ModaleDettagliImmobile
          immobile={immobileSelezionato}
          onClose={() => setImmobileSelezionato(null)}
        />
      )}

      <Footer />
    </>
  );
}
