import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [societa, setSocieta] = useState("");
  const [pec, setPec] = useState("");
  const [telefono, setTelefono] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8080/posts/register-agency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ societa, pec, telefono }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Richiesta inviata con successo. Controlla la PEC per la password.");
        setSocieta("");
        setPec("");
        setTelefono("");

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setErrorMessage(data.error || "Errore durante la registrazione.");
      }
    } catch (err) {
      console.error("Errore invio:", err);
      setErrorMessage("Errore server.");
    }
  };

  return (
    <>
      <div className="w-full border-t border-black" />

      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div
          id="registrazione_azienda"
          className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat px-8 py-16"
          style={{ backgroundImage: 'url("/immagine-candidatura.jpg")' }}
        >
          <div className="absolute inset-0 bg-gray-800 opacity-50 z-0"></div>

          <div className="relative z-10 max-w-md text-center text-white space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Dai forma al futuro dell'immobiliare con noi.
            </h1>
            <p className="text-lg">
              Su <span className="font-semibold text-blue-300">DietiEstates25</span> cerchiamo professionisti ambiziosi e affidabili per espandere la nostra rete.
            </p>
            <p className="text-md text-blue-200">
              Costruiamo insieme un servizio di eccellenza.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16 bg-white shadow-xl">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Invia candidatura</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="societa" className="block text-sm font-medium text-black mb-1">
                  Nome società
                </label>
                <input
                  type="text"
                  id="societa"
                  value={societa}
                  onChange={(e) => setSocieta(e.target.value)}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci il nome della società"
                />
              </div>

              <div>
                <label htmlFor="pec" className="block text-sm font-medium text-black mb-1">
                  PEC
                </label>
                <input
                  type="email"
                  id="pec"
                  value={pec}
                  onChange={(e) => setPec(e.target.value)}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci la tua PEC"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-black mb-1">
                  Telefono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  placeholder="Inserisci il tuo recapito telefonico"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow transition duration-200"
              >
                Invia richiesta
              </button>

              {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
              {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
