import Link from "next/link";
import { companyInfo } from "@/config/company";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Top section with company info */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold leading-6 text-white">
              Company
            </h3>
            <p className="text-xs text-gray-400">{companyInfo.legalName}</p>
            <p className="text-xs text-gray-400">
              {companyInfo.address.street}, {companyInfo.address.city}
            </p>
            <p className="text-xs text-gray-400">
              {companyInfo.address.country}
            </p>
          </div>
          <div className="mt-8 xl:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-white">
              Contact
            </h3>
            <p className="text-xs text-gray-400 mt-4">
              Email: {companyInfo.contact.email}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {companyInfo.businessHours.days}:{" "}
              {companyInfo.businessHours.hours}{" "}
              {companyInfo.businessHours.timezone}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Live Chat: {companyInfo.businessHours.liveChat}
            </p>
          </div>
          <div className="mt-8 xl:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-white">
              Regulatory
            </h3>
            <p className="text-xs text-gray-400 mt-4">
              Status:{" "}
              {companyInfo.registration.status === "proposed"
                ? "Proposed registration"
                : "Registered"}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Framework: {companyInfo.registration.authority}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Regulators: {companyInfo.regulators.join(", ")}
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link
              href="/privacy"
              className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 text-sm"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 text-sm"
            >
              About
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-400 dark:text-gray-300">
              &copy; {companyInfo.registration.year} {companyInfo.legalName}.
              All rights reserved.
            </p>
            <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400 mt-1">
              Transforming diaspora remittances into productive Nigerian
              investments.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
