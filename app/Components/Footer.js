import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-800 py-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center text-center md:text-left">
        {/* Testo ispirazionale */}
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">DietiEstates25</h2>
          <p className="text-gray-700">
            La casa giusta ti cambia la vita. Noi ti aiutiamo a trovarla.
          </p>
        </div>

        {/* Link social */}
        <div className="flex justify-center md:justify-end space-x-6">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="Instagram"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="Facebook"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="Twitter"
          >
            <FaXTwitter size={24} />
          </a>
        </div>
      </div>

      {/* Linea e copyright */}
      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} DietiEstates25. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
