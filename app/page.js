"use client";
import React from "react";
import NotLoggedNavBar from "./Components/NotLoggedNavBar";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <> 
        <NotLoggedNavBar />
        <HomePage />
        <Login />
        <Footer />
    </>
  );
}
