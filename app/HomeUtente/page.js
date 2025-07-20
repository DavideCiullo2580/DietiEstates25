"use client";
import React from "react";
import NavbarUtente from "../Components/NavbarUtente";
import ImmobiliVicini from "../Components/ImmobiliVicini";
import Footer from "../Components/Footer";

export default function HomeUtente() {
  return (
    <>
      <NavbarUtente />
      <ImmobiliVicini />
      <Footer />
    </>
  );
}
