"use client";
import React from "react";
import NavbarGestore from "../Components/NavbarGestore";
import ImmobiliPage from "../Components/ImmobiliPage";
import Footer from "../Components/Footer";

export default function HomeAmministratore() {
  return (
    <> 
       <NavbarGestore />
       <ImmobiliPage/>
       <Footer />
    </>
  );
}
