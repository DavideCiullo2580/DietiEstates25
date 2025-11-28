"use client";
import React from "react";

export default function ModaleLogout({ visible, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        
        <h2 className="text-xl font-semibold mb-4 text-center">
          Sei sicuro di voler effettuare il logout?
        </h2>

        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            Annulla
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
