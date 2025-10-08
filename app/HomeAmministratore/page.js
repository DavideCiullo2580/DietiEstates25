"use client";
import { useState } from "react";
import NavbarAmministratore from "../Components/NavbarAmministratore";
import Footer from "../Components/Footer";
import ImmobiliPage from "../Components/ImmobiliPage";
import MappaImmobili from "../Components/MappaImmobili";
import ModaleDettagliImmobile from "../Components/ModaleDettagliImmobile";

export default function ImmobiliPageAmministratore() {
  const [immobili, setImmobili] = useState([]);
  const [immobileSelezionato, setImmobileSelezionato] = useState(null);

  return (
    <>
      <NavbarAmministratore />

      <div className="px-4 py-10 lg:max-w-7xl lg:mx-auto lg:flex lg:gap-6">
        <div className="lg:w-1/2 h-[80vh] overflow-y-auto">
          <ImmobiliPage
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
