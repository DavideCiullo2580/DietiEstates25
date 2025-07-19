"use client";
import React from "react";
import NavbarGestore from "../Components/NavbarGestore";
import ImmobiliPage from "../Components/ImmobiliPage";
import Footer from "../Components/Footer";
import NavbarAgenteImmobiliare from "../Components/NavbarAgenteImmobiliare";

export default function HomeAgenteImmobiliare() {
  return (
    <> 
       <NavbarAgenteImmobiliare />
       <ImmobiliPage/>
       <Footer />
    </>
  );
}
