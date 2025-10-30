"use client";
import React from "react";

export default function ModaleDettagliImmobile({ immobile, onClose }) {
  if (!immobile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
        >
          &times;
        </button>

        <img
          src={immobile.immagine_url || "/placeholder.jpg"}
          alt="Immagine immobile"
          className="w-full h-64 object-cover rounded mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{immobile.tipo_immobile}</h2>

        <p>
          <strong>📍 Indirizzo:</strong> {immobile.indirizzo}
        </p>
        <p>
          <strong>💶 Prezzo:</strong> €{immobile.prezzo}
        </p>
        <p>
          <strong>📐 Dimensioni:</strong> {immobile.dimensioni} mq
        </p>
        <p>
          <strong>🛏️ Stanze:</strong> {immobile.stanze}
        </p>
        <p>
          <strong>🏢 Piano:</strong> {immobile.piano}
        </p>
        <p>
          <strong>⚡ Classe energetica:</strong> {immobile.classe_energetica}
        </p>
        <p>
          <strong>📝 Descrizione:</strong> {immobile.descrizione}
        </p>
        <p>
          <strong>🛠 Servizi:</strong>{" "}
          {immobile.servizi?.join(", ") || "Nessuno"}
        </p>
      </div>
    </div>
  );
}
