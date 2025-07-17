import Link from 'next/link'

export default function NotLoggedNavBar() {
  return (
    <nav className="bg-white border-b border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo a sinistra */}
          <Link href="/" className="text-xl font-bold text-black">
            MyApp
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