"use client";

import { useState } from "react";

export default function AggiungiMembro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confermaPassword: "",
    ruolo: "Agente immobiliare",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
        <h2 className="text-2xl font-bold text-center mb-4">
          Aggiungi Membro
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Inserisci nome
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Inserisci e-mail
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Inserisci password
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Ripeti password
          </label>
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
            <option>Agente immobiliare</option>
            <option>Gestore</option>
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
