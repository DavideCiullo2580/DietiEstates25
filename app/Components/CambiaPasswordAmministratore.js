"use client";

import React from "react";

export default function CambiaPasswordAmministratore() {
  return (
    <div
      className="bg-gray-100 pt-6 pb-6 px-4 min-h-full flex items-center justify-center"
      style={{ backgroundImage: 'url("/SfondoHome.png")', backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <form className="max-w-md w-full bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Cambia Password
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vecchia Password
          </label>
          <input
            type="password"
            name="vecchiaPassword"
            placeholder="Inserisci la vecchia password"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nuova Password
          </label>
          <input
            type="password"
            name="nuovaPassword"
            placeholder="Inserisci la nuova password"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ripeti Password
          </label>
          <input
            type="password"
            name="ripetiPassword"
            placeholder="Ripeti la nuova password"
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
      </form>
    </div>
  );
}
