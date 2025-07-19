"use client";
import React from "react";
import NavbarAmministratore from "../Components/NavbarAmministratore";
import AggiungiMembro from "../Components/AggiungiMembro";
import Footer from "../Components/Footer";

export default function AggiungiAgenteForm() {
  return (
    <> 
      <NavbarAmministratore />
      <AggiungiMembro />
      <Footer />
    </>
  );
}
