import Link from 'next/link'
import Image from 'next/image';

export default function NotLoggedNavBar() {
  return (
    <nav className="bg-white border-b border-black sticky top-0 z-50 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-between h-20"> {/* qui cambiato da h-16 a h-20 */}
      {/* Logo a sinistra */}
      <Link href="/" className="flex items-center h-full">
        <Image
          src="/dietiestates25-logo.png"
          alt="DietiEstates25 Logo"
          width={180}
          height={50}
          className="block"
        />
      </Link>

      {/* Link a destra */}
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="text-black hover:text-blue-600">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-black hover:text-blue-600">
            About
          </Link>
        </li>
        <li>
          <Link href="/services" className="text-black hover:text-blue-600">
            Services
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-black hover:text-blue-600">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>

  )
}
