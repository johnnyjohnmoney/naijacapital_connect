import {
  ShieldCheckIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { teamMembers } from "@/config/team";
import { companyMission, marketStats } from "@/config/company";

const features = [
  {
    name: "Security & Compliance",
    description:
      "Bank-level security measures with SEC and CBN regulatory compliance framework to protect your investments and personal information.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Expert Founding Team",
    description:
      "Experienced founders across finance, technology, operations, and investment partnerships with deep Nigerian market knowledge.",
    icon: UserGroupIcon,
  },
  {
    name: "Global Diaspora Reach",
    description:
      "Connecting 17 million Nigerians abroad with verified local investment opportunities in agriculture, real estate, and SMEs.",
    icon: GlobeAltIcon,
  },
  {
    name: "Transparent Impact Tracking",
    description:
      "Real-time portfolio monitoring with ROI calculations and social impact metrics through our ImpactTrack Dashboard.",
    icon: ChartBarIcon,
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
            Transforming diaspora remittances into productive investments that
            drive sustainable economic growth in Nigeria.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            NaijaConnect Capital Company Limited | Victoria Island, Lagos,
            Nigeria
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
              {companyMission.vision}
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {companyMission.mission}
            </p>
          </div>

          {/* Core Values */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 text-center mb-12">
              Our Core Values
            </h3>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
              {companyMission.values.map((value) => (
                <div key={value.name} className="relative">
                  <dt className="text-base font-semibold leading-7 text-gray-900 text-center">
                    {value.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 text-center">
                    {value.description}
                  </dd>
                </div>
              ))}
            </dl>
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
                Market Opportunity
              </h2>
              <p className="mt-4 text-lg leading-8 text-green-100">
                Tapping into Nigeria's massive diaspora remittance market to
                drive productive investments.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Diaspora Remittances (2024)
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  ${marketStats.remittanceVolume.value}B
                </dd>
                <dd className="text-xs text-green-200 mt-1">
                  {marketStats.remittanceVolume.source}
                </dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Nigerians Abroad
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  {marketStats.diasporaPopulation.value}M+
                </dd>
                <dd className="text-xs text-green-200 mt-1">Target market</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Target Investors (3 years)
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  {marketStats.targetInvestors.value.toLocaleString()}
                </dd>
                <dd className="text-xs text-green-200 mt-1">Onboarding goal</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Investment Target (2028)
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  ₦{marketStats.targetInvestment.min}-
                  {marketStats.targetInvestment.max}B
                </dd>
                <dd className="text-xs text-green-200 mt-1">Total inflows</dd>
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
              Meet the Founding Team
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our experienced founding team brings together deep expertise in
              finance, technology, operations, and investment partnerships.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {teamMembers.map((person) => (
              <li key={person.id}>
                <div className="aspect-w-3 aspect-h-2">
                  <div className="h-64 w-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex flex-col items-center justify-center p-6">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold text-green-600">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="text-sm text-green-700 font-medium">
                      {person.role}
                    </span>
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-green-600 font-medium">
                  {person.title}
                </p>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {person.description}
                </p>
                {person.expertise && person.expertise.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {person.expertise.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Regulatory Notice */}
          <div className="mx-auto mt-16 max-w-2xl rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-600">
              <strong>Company Status:</strong> NaijaConnect Capital Company
              Limited is in the process of registration under the Companies and
              Allied Matters Act (CAMA) 2020, with planned regulatory compliance
              with the Securities and Exchange Commission (SEC) and Central Bank
              of Nigeria (CBN).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
