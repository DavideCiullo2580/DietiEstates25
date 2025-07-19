"use client";
import React from "react";
import NavbarAgenteImmobiliare from "../Components/NavbarAgenteImmobiliare";
import AggiungiImmobile from "../Components/AggiungiImmobile";
import Footer from "../Components/Footer";

export default function AggiungiImmobileForm() {
  return (
    <> 
      <NavbarAgenteImmobiliare />
      <AggiungiImmobile />
      <Footer />
    </>
  );
}
