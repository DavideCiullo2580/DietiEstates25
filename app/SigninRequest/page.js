"use client";
import React from "react";
import NotLoggedNavBar from "../Components/NotLoggedNavBar";
import HomePage from "../Components/HomePage";
import SignInAzienda from "../Components/SignInAzienda";
import Footer from "../Components/Footer";

export default function Home() {
  return (
    <> 
        <NotLoggedNavBar />
        <HomePage />
        <SignInAzienda />
        <Footer />
    </>
  );
}
