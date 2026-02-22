import Image from "next/image";
import {
  ShieldCheckIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Low-Cost Remittance Gateway",
    description:
      "Transfer funds at just 2% transaction fee—significantly lower than the industry average of 4-6%. Smooth cross-border transfers with competitive exchange rates.",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Curated Investment Marketplace",
    description:
      "Access a digital dashboard of pre-vetted local ventures in real estate, agriculture, SMEs, and infrastructure projects.",
    icon: ChartBarIcon,
  },
  {
    name: "Investment Monitoring & Impact Tracking",
    description:
      "Real-time data to monitor fund performance, social impact metrics, and return on investment through our ImpactTrack Dashboard.",
    icon: DocumentChartBarIcon,
  },
  {
    name: "Regulatory Compliance & Trust",
    description:
      "SEC-licensed and CBN-registered platform with thorough AML/CTF compliance, providing diaspora investors with a safe and reliable investment channel.",
    icon: ShieldCheckIcon,
  },
];

const team = [
  {
    name: "Temitayo Sunmonu-Balogun",
    role: "Chief Executive Officer (CEO)",
    description:
      "A finance and management professional with over 10 years of experience in accounting, finance, and corporate leadership. Strong record of promoting growth, improving operations, and ensuring financial responsibility.",
    image: "/team/Temitayo.jpeg",
  },
  {
    name: "Kevin Odiley",
    role: "Chief Operating Officer (COO)",
    description:
      "A results-driven operations leader with strong commercial and growth expertise, experienced in scaling customer-centric services through data-driven strategies. Known for aligning people, processes, and platforms to drive revenue growth and deliver sustained value.",
    image: "/team/Kevin.jpeg",
  },
  {
    name: "Eric Ojeaga",
    role: "Chief Financial Officer (CFO)",
    description:
      "A skilled finance professional with solid analytical and quantitative abilities in corporate finance, accounting, and investment management. Proficient in capital allocation and financial forecasting.",
    image: "/team/Eric.png",
  },
  {
    name: "Emmanuel Orevba",
    role: "Chief Technology Officer (CTO)",
    description:
      "A strategic and execution-focused Chief Technology Officer with proven experience delivering secure, high-volume payment systems and digital banking solutions. Skilled in architecting scalable lending platforms and integrating APIs that support real-time transactions.",
    image: "/team/Emmanuel.png",
  },
  {
    name: "Kikelomo Abikele",
    role: "Head, Investment & Partnerships",
    description:
      "Extensive experience in identifying impactful investment opportunities. Proven success in building stakeholder relationships, negotiating agreements, and driving strategic growth initiatives.",
    image: "/team/Kiki.jpeg",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            About NaijaConnect Capital
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A digital fintech platform that channels diaspora remittances
            directly into pre-vetted, high-impact investment opportunities in
            Nigeria—transforming remittances from consumption into productive
            capital.
          </p>
        </div>
      </div>

      {/* Mission section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">
              Our Mission
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Transforming Remittances Into Productive Capital
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              NaijaConnect Capital connects diaspora senders with the domestic
              investment market, changing the way remittance inflows are
              used—turning them from consumption into productive capital for
              small businesses, real estate, agriculture, and infrastructure
              projects. We provide transparency, thorough research, and
              regulatory compliance to give Nigerians abroad a safe and reliable
              way to invest in their home country.
            </p>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built on Trust, Security, and Excellence
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

      {/* Stats section */}
      <div className="bg-green-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our Growth Targets
              </h2>
              <p className="mt-4 text-lg leading-8 text-green-100">
                Nigeria received USD 20.98 billion in diaspora remittances in
                2024—nearly 6% of GDP. We're positioned to transform how these
                funds create lasting impact.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Investment Target by 2028
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  ₦3-5B
                </dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Investor Target (3 Years)
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  2,000
                </dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Transaction Fee
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  2%
                </dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Break-Even Target
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  24-30 mo
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">
              Our Leadership
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet the Team Behind NaijaConnect Capital
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our experienced leadership team brings together expertise in
              finance, technology, and African markets.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-5"
          >
            {team.map((person) => (
              <li key={person.name}>
                <div className="relative h-56 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-green-600">
                  {person.role}
                </p>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {person.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
