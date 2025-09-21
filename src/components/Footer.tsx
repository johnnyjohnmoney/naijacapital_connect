import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="/privacy"
            className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
          >
            Contact
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-400 dark:text-gray-300">
            &copy; 2024 NaijaConnect Capital. All rights reserved. Connecting
            diaspora investments with Nigerian opportunities.
          </p>
        </div>
      </div>
    </footer>
  );
}
