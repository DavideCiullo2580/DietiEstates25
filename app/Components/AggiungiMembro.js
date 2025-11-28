"use client";

import { useState } from "react";

export default function AggiungiMembro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confermaPassword: "",
    ruolo: "agente",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confermaPassword) {
      setMessage("Le password non corrispondono.");
      setMessageType("error");      
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Utente non autenticato.");
        setMessageType("error");        
        return;
      }

      const res = await fetch("http://localhost:8080/posts/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          ruolo: formData.ruolo.toLowerCase(), 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
              setMessage(data.error || "Errore imprevisto.");
              setMessageType("error");
      } else {
        setMessage(data.message);
        setMessageType("success");

        setFormData({
          nome: "",
          email: "",
          password: "",
          confermaPassword: "",
          ruolo: "agente",
        });
      }
    } catch (err) {
      setMessage("Errore di rete o server non raggiungibile.");
      setMessageType("error");
    }
  };

  return (
    <div
      className="bg-gray-100 pt-6 pb-6 px-4 min-h-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/SfondoHome.png")' }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Aggiungi Membro</h2>

        {message && (
          <div
            className={`text-sm text-center p-2 rounded ${
              messageType === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Inserisci nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Inserisci e-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Inserisci password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ripeti password</label>
          <input
            type="password"
            name="confermaPassword"
            value={formData.confermaPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ruolo</label>
          <select
            name="ruolo"
            value={formData.ruolo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="agente">Agente</option>
            <option value="gestore">Gestore</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 transition duration-200"
        >
          Aggiungi Membro
        </button>
      </form>
    </div>
  );
}
