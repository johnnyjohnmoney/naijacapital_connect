import {
  ShieldCheckIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Security First",
    description:
      "We employ bank-level security measures to protect your investments and personal information.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Expert Team",
    description:
      "Our team combines financial expertise with deep knowledge of the Nigerian market.",
    icon: UserGroupIcon,
  },
  {
    name: "Global Reach",
    description:
      "Connecting diaspora investors worldwide with opportunities in Nigeria.",
    icon: GlobeAltIcon,
  },
  {
    name: "Proven Results",
    description:
      "Track record of successful investments and satisfied investors.",
    icon: ChartBarIcon,
  },
];

const team = [
  {
    name: "Adebayo Ogundimu",
    role: "Chief Executive Officer",
    description: "15+ years in financial services and African markets",
    image: "/api/placeholder/150/150",
  },
  {
    name: "Kemi Adeleke",
    role: "Chief Investment Officer",
    description: "Former Goldman Sachs, expert in emerging markets",
    image: "/api/placeholder/150/150",
  },
  {
    name: "Chidi Okafor",
    role: "Head of Risk Management",
    description: "Risk assessment specialist with focus on African markets",
    image: "/api/placeholder/150/150",
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
            Bridging the gap between diaspora capital and Nigerian investment
            opportunities through technology, expertise, and trust.
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
              Empowering Economic Growth Through Strategic Investment
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We believe that by connecting Nigerian diaspora investors with
              carefully vetted local business opportunities, we can drive
              sustainable economic growth while providing attractive returns to
              our investors.
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
                Our Impact in Numbers
              </h2>
              <p className="mt-4 text-lg leading-8 text-green-100">
                Since our launch, we've been making a significant impact in
                connecting diaspora investments with Nigerian opportunities.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Total Investments
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  ₦2.5B+
                </dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Active Investors
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  1,200+
                </dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Successful Projects
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  85+
                </dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-green-100">
                  Average ROI
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  18%
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
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {team.map((person) => (
              <li key={person.name}>
                <div className="aspect-w-3 aspect-h-2">
                  <div className="h-48 w-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Photo</span>
                  </div>
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
