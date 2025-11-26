"use client";
import React, { useEffect } from "react";
import NotLoggedNavBar from "./Components/NotLoggedNavBar";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";
import Footer from "./Components/Footer";

export default function Home() {

 useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
  }, []);

  return (
    <> 
        <NotLoggedNavBar />
        <HomePage />
        <Login />
        <Footer />
    </>
  );
}
   