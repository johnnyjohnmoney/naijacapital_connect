import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/NACC_logo.png"
                alt="NaijaConnect Capital"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="text-white font-semibold text-lg">
                NaijaConnect Capital
              </span>
            </div>
            <p className="text-gray-400 dark:text-gray-300 text-sm mb-4 max-w-md">
              Africa&apos;s most trusted platform for diaspora
              investments—connecting Nigerians abroad to transparent, secure,
              and impactful ventures in Nigeria.
            </p>
            <div className="text-gray-400 dark:text-gray-300 text-sm space-y-1">
              <p>📍 Victoria Island, Lagos, Nigeria</p>
              <p>📧 info@naijaconnect.com.ng</p>
              <p>🕐 Mon-Fri: 8AM - 6PM WAT</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 dark:text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/opportunities"
                  className="text-gray-400 dark:text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm"
                >
                  Investment Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="text-gray-400 dark:text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm"
                >
                  Investment Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 dark:text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 dark:text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 dark:text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs">
                SEC Licensed • CBN Registered
              </p>
              <p className="text-gray-500 text-xs mt-1">AML/CTF Compliant</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-center md:text-left text-xs leading-5 text-gray-400 dark:text-gray-300">
            &copy; 2025 NaijaConnect Capital Company Limited. All rights
            reserved.
          </p>
          <p className="text-center md:text-right text-xs leading-5 text-gray-500 mt-2 md:mt-0">
            Transforming diaspora remittances into productive Nigerian
            investments.
          </p>
        </div>
      </div>
    </footer>
  );
}
