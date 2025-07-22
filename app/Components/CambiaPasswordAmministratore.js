"use client";

import React, { useState } from "react";

export default function CambiaPasswordAmministratore() {
  const [vecchiaPassword, setVecchiaPassword] = useState("");
  const [nuovaPassword, setNuovaPassword] = useState("");
  const [ripetiPassword, setRipetiPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (nuovaPassword !== ripetiPassword) {
      setError("Le nuove password non coincidono.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utente non autenticato. Effettua il login.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/posts/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ vecchiaPassword, nuovaPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setVecchiaPassword("");
        setNuovaPassword("");
        setRipetiPassword("");
      } else {
        setError(data.error || "Errore durante il cambio password.");
      }
    } catch (err) {
      setError("Errore di connessione al server.");
    }
  };

  return (
    <div
      className="bg-gray-100 pt-6 pb-6 px-4 min-h-full flex items-center justify-center"
      style={{ backgroundImage: 'url("/SfondoHome.png")', backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Cambia Password</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vecchia Password</label>
          <input
            type="password"
            value={vecchiaPassword}
            onChange={(e) => setVecchiaPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nuova Password</label>
          <input
            type="password"
            value={nuovaPassword}
            onChange={(e) => setNuovaPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ripeti Password</label>
          <input
            type="password"
            value={ripetiPassword}
            onChange={(e) => setRipetiPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 transition duration-200"
        >
          Cambia Password
        </button>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
