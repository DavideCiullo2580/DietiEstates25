export default function Login() {
  return (
    <section className="min-h-screen flex items-center justify-end bg-gray-100 px-4 md:px-12 py-16">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">Accedi</h2>

        <form className="space-y-6">
          <div>
            <label htmlFor="login-username" className="block text-sm font-medium text-black mb-1">
              Username
            </label>
            <input
              type="text"
              id="login-username"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              placeholder="Inserisci il tuo username"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              placeholder="Inserisci la tua password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-200"
          >
            Accedi
          </button>
        </form>
      </div>
    </section>
  );
}
