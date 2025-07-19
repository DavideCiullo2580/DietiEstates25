"use client";
import React from "react";
import NavbarAmministratore from "../Components/NavbarAmministratore";
import ImmobiliPage from "../Components/ImmobiliPage";
import Footer from "../Components/Footer";

export default function HomeAmministratore() {
  return (
    <> 
       <NavbarAmministratore />
       <ImmobiliPage />
       <Footer />
    </>
  );
}
