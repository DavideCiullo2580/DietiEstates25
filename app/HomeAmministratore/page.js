"use client";
import React from "react";
import NavbarAmministratore from "../Components/NavbarAmministratore";
import ImmobiliPageAmministratore from "../Components/ImmobiliPageAmministratore";
import Footer from "../Components/Footer";

export default function HomeAmministratore() {
  return (
    <> 
       <NavbarAmministratore />
       <ImmobiliPageAmministratore />
       <Footer />
    </>
  );
}
