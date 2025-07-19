"use client";
import React from "react";
import NavbarGestore from "../Components/NavbarGestore";
import ImmobiliPageAmministratore from "../Components/ImmobiliPageAmministratore";
import Footer from "../Components/Footer";

export default function HomeAmministratore() {
  return (
    <> 
       <NavbarGestore />
       <ImmobiliPageAmministratore />
       <Footer />
    </>
  );
}
