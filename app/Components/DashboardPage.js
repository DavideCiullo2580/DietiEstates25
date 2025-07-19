"use client";

export default function DashboardPage() {
  return (
    <div
      className="bg-gray-100 min-h-screen px-6 py-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/SfondoHome.png")' }}
    >
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-950">
        Dashboard Immobili
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Qui metterai la lista di immobili dinamica */}
        <p className="text-center text-gray-600">
          Nessun immobile da visualizzare.
        </p>
      </div>
    </div>
  );
}
