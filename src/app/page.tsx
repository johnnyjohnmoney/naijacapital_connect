import Link from "next/link";
import type { Metadata } from "next";
import {
  CheckIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "NaijaConnect Capital - Diaspora Investment Platform",
  description:
    "Connect your capital with vetted Nigerian investment opportunities. Secure, transparent, and profitable investments for the diaspora community.",
  keywords:
    "Nigerian investments, diaspora, capital, investment platform, Nigeria, returns",
  openGraph: {
    title: "NaijaConnect Capital - Diaspora Investment Platform",
    description:
      "Connect your capital with vetted Nigerian investment opportunities.",
    type: "website",
  },
};

const features = [
  {
    name: "Secure Investment Platform",
    description:
      "Bank-level security with encrypted transactions and secure data storage for all your investments.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Pre-vetted Opportunities",
    description:
      "All investment opportunities are thoroughly researched and vetted by our expert team.",
    icon: CheckIcon,
  },
  {
    name: "Competitive Returns",
    description:
      "Access high-yield investment opportunities with attractive returns and transparent fee structure.",
    icon: ArrowTrendingUpIcon,
  },
  {
    name: "Global Accessibility",
    description:
      "Invest from anywhere in the world with our user-friendly platform designed for the diaspora.",
    icon: GlobeAltIcon,
  },
];

const testimonials = [
  {
    content:
      "NaijaConnect made it so easy to invest back home. The returns have been fantastic!",
    author: "Adaora K.",
    role: "Software Engineer, Canada",
  },
  {
    content:
      "Finally, a platform I trust with my Nigerian investments. Transparent and secure.",
    author: "Michael O.",
    role: "Doctor, UK",
  },
  {
    content:
      "The vetting process gives me confidence. Great ROI on my agri-business investment.",
    author: "Funmi A.",
    role: "Business Analyst, USA",
  },
];

const steps = [
  {
    id: "01",
    name: "Create Account",
    description:
      "Sign up with your email and complete our simple verification process.",
  },
  {
    id: "02",
    name: "Browse Opportunities",
    description:
      "Explore vetted investment opportunities across various sectors in Nigeria.",
  },
  {
    id: "03",
    name: "Invest Securely",
    description:
      "Choose your investment amount and complete secure transactions.",
  },
  {
    id: "04",
    name: "Track & Earn",
    description:
      "Monitor your investments and receive returns directly to your account.",
  },
];

const stats = [
  { id: 1, name: "Total Capital Raised", value: "₦2.5B+" },
  { id: 2, name: "Active Investors", value: "1,200+" },
  { id: 3, name: "Successful Projects", value: "85+" },
  { id: 4, name: "Average ROI", value: "18%" },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect Your Capital with Nigerian Opportunities
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              NaijaConnect Capital bridges the gap between diaspora investments
              and vetted Nigerian business opportunities. Invest securely, earn
              competitively, and contribute to Nigeria's economic growth.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transform transition-all duration-200 hover:scale-105"
              >
                Start Investing
              </Link>
              <Link
                href="/opportunities"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600 transition-colors duration-200"
              >
                View Opportunities <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-green-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-green-100">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">
              Secure & Transparent
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose NaijaConnect Capital?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform combines cutting-edge technology with deep market
              expertise to provide diaspora investors with secure, profitable
              investment opportunities in Nigeria.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-400">
              Simple Process
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Getting started with NaijaConnect Capital is simple. Follow these
              four easy steps to begin your investment journey.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {step.id}
                      </span>
                    </div>
                    {step.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{step.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Diaspora Investors
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              See what our community has to say about their investment
              experience.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <figure
                key={testimonialIdx}
                className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl transition-shadow duration-300"
              >
                <blockquote className="text-gray-900">
                  <p>"{testimonial.content}"</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-3xl font-bold leading-10 tracking-tight text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6 divide-y divide-gray-900/10">
              <div className="pt-6">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Is my investment secure?
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Yes, we use bank-level encryption and all opportunities are
                  thoroughly vetted by our expert team.
                </dd>
              </div>
              <div className="pt-6">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  What's the minimum investment amount?
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our minimum investment starts from $100 USD or ₦50,000, making
                  it accessible for diaspora investors.
                </dd>
              </div>
              <div className="pt-6">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  How do I receive my returns?
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Returns are automatically transferred to your registered bank
                  account or digital wallet quarterly.
                </dd>
              </div>
              <div className="pt-6">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Can I invest from outside Nigeria?
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Yes, our platform is specifically designed for diaspora
                  investors and supports international payment methods.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-green-50">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of diaspora investors who trust NaijaConnect
              Capital for their Nigerian investment needs. Create your account
              today and explore vetted opportunities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transform transition-all duration-200 hover:scale-105"
              >
                Get Started Today
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600 transition-colors duration-200"
              >
                Contact Our Team <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
