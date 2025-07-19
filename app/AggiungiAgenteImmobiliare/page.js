"use client";
import React from "react";
import NavbarGestore from "../Components/NavbarGestore";
import AggiungiAgenteImmobiliare from "../Components/AggiungiAgenteImmobiliare";
import Footer from "../Components/Footer";

export default function AggiungiAgenteForm() {
  return (
    <> 
      <NavbarGestore />
      <AggiungiAgenteImmobiliare />
      <Footer />
    </>
  );
}
