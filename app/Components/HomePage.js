import Head from 'next/head';

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/SfondoHome.png")' }}
    >
      <Head>
        <title>Home - DietiEstates25</title>
        <meta
          name="description"
          content="Benvenuti su DietiEstates25, la vostra soluzione per la gestione di immobili."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <main className="relative z-10 text-white px-6">
        <div className="flex flex-col items-center justify-center min-h-screen text-center -translate-y-8 opacity-0 animate-fadeIn">
          <h1 className="text-5xl font-extrabold leading-tight">
            Benvenuti su <span className="text-blue-950">DietiEstates25</span>
          </h1>
          <p className="mt-4 text-xl">Trova la casa giusta per te.</p>
          <p className="mt-2 text-lg">Selezioniamo solo immobili che fanno la differenza.</p>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
