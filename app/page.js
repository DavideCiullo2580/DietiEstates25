"use client";
import React from "react";
import NotLoggedNavBar from "./Components/NotLoggedNavBar";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";

export default function Home() {
  return (
    <> 
        <NotLoggedNavBar />
        <HomePage />
        <Login />
    </>
  );
}
