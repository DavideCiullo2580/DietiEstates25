"use client";
import React from "react";
import NavbarAgenteImmobiliare from "../Components/NavbarAgenteImmobiliare";
import DashboardPage from "../Components/DashboardPage";
import Footer from "../Components/Footer";

export default function VisualizzaDashboard() {
  return (
    <> 
       <NavbarAgenteImmobiliare />
       <DashboardPage />
       <Footer />
    </>
  );
}
