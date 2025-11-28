"use client";
import { useState } from "react";

export default function AggiungiAgenteImmobiliare() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confermaPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confermaPassword) {
      setMessage("Le password non corrispondono.");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Utente non autenticato.");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/posts/add-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          password: formData.password,
          confermaPassword: formData.confermaPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Errore durante la registrazione.");
        setMessageType("error");
      } else {
        setMessage(data.message || "Agente aggiunto con successo!");
        setMessageType("success");
        setFormData({
          nome: "",
          email: "",
          password: "",
          confermaPassword: "",
        });
      }
    } catch (err) {
      setMessage("Errore di connessione con il server.");
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
        <h2 className="text-2xl font-bold mb-4 text-center">Aggiungi agente immobiliare</h2>


        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
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
          <label className="block text-sm font-medium text-gray-700">Email</label>
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
          <label className="block text-sm font-medium text-gray-700">Password</label>
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
          <label className="block text-sm font-medium text-gray-700">Conferma Password</label>
          <input
            type="password"
            name="confermaPassword"
            value={formData.confermaPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          
        </div>
        {message && (
           <p
            className={`text-sm text-center ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 transition duration-200"
        >
          Aggiungi agente
        </button>
      </form>
    </div>
  );
}
