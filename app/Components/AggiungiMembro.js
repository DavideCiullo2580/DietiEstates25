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

  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confermaPassword) {
      setFeedback({ type: "error", message: "Le password non corrispondono." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFeedback({ type: "error", message: "Utente non autenticato." });
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
        setFeedback({ type: "error", message: data.error || "Errore imprevisto." });
      } else {
        setFeedback({ type: "success", message: data.message });
        setFormData({
          nome: "",
          email: "",
          password: "",
          confermaPassword: "",
          ruolo: "agente",
        });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Errore di rete o server non raggiungibile." });
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

        {feedback && (
          <div
            className={`text-sm text-center p-2 rounded ${
              feedback.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {feedback.message}
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
