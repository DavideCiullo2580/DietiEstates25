"use client";
import React from "react";
import NotLoggedNavBar from "../Components/NotLoggedNavBar";
import SignUpForm from "../Components/SignUpForm";
import HomePage from "../Components/HomePage";
import Footer from "../Components/Footer";

export default function SignUpPage() {
  return (
    <> 
        <NotLoggedNavBar />       
        <HomePage />               
        <SignUpForm />
        <Footer />
    </>
  );
}
