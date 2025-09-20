import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/privacy" className="text-gray-400 hover:text-gray-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-gray-300">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-gray-300">
            Contact
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-400">
            &copy; 2024 NaijaConnect Capital. All rights reserved. Connecting
            diaspora investments with Nigerian opportunities.
          </p>
        </div>
      </div>
    </footer>
  );
}
