"use client";
import React from "react";
import NavbarAmministratore from "../Components/NavbarAmministratore";
import CambiaPasswordAmministratore from "../Components/CambiaPasswordAmministratore";
import Footer from "../Components/Footer";

export default function Home() {
  return (
    <> 
      <NavbarAmministratore />
      <CambiaPasswordAmministratore />
      <Footer />
    </>
  );
}
