/**
 * NaijaConnect Capital Company Information
 * Source: Official Business Plan December 2025
 */

export const companyInfo = {
  legalName: "NaijaConnect Capital Company Limited",
  tradingName: "NaijaConnect Capital",
  address: {
    street: "Victoria Island",
    city: "Lagos",
    country: "Nigeria",
  },
  contact: {
    email: "info@naijaconnect.com.ng",
    website: "www.optifund.ng",
    phone: "", // To be added when available
  },
  registration: {
    status: "proposed" as const,
    authority: "Companies and Allied Matters Act (CAMA) 2020",
    year: 2025,
  },
  regulators: [
    "Securities and Exchange Commission (SEC)",
    "Central Bank of Nigeria (CBN)",
  ],
  businessHours: {
    days: "Monday to Friday",
    hours: "8:00 AM - 6:00 PM",
    timezone: "WAT",
    liveChat: "8:00 AM - 9:00 PM WAT",
  },
  social: {
    twitter: "", // To be added
    linkedin: "", // To be added
    instagram: "", // To be added
    facebook: "", // To be added
  },
};

export const marketStats = {
  remittanceVolume: {
    value: 20.98,
    currency: "USD",
    unit: "billion",
    year: 2024,
    source: "World Bank, 2024",
  },
  gdpPercentage: {
    value: 6,
    description: "Remittances as % of Nigerian GDP",
    source: "World Bank, 2024",
  },
  diasporaPopulation: {
    value: 17,
    unit: "million",
    description: "Nigerians living abroad",
  },
  targetInvestors: {
    value: 10000,
    timeframe: "first 3 years",
    description: "Expected diaspora investors to onboard",
  },
  targetInvestment: {
    min: 3,
    max: 5,
    currency: "NGN",
    unit: "billion",
    year: 2028,
    description: "Total investment inflows target",
  },
  fintechGrowth: {
    value: 22,
    unit: "percent",
    period: "annual",
    source: "Statista, 2024",
  },
  smartphoneUsage: {
    value: 55,
    unit: "percent",
    description: "Smartphone penetration in Nigeria",
    source: "NCC, 2024",
  },
};

export const companyMission = {
  mission:
    "To transform diaspora remittances from consumption-based transfers into productive capital investments that drive sustainable economic growth in Nigeria.",
  vision:
    "To become the leading digital platform connecting Nigerian diaspora investors with verified, high-impact investment opportunities across agriculture, real estate, SMEs, and infrastructure sectors.",
  values: [
    {
      name: "Transparency",
      description:
        "We maintain complete openness in our operations, investment vetting, and reporting to build trust with our diaspora community.",
    },
    {
      name: "Security",
      description:
        "Bank-level security measures and regulatory compliance protect every investment and personal information.",
    },
    {
      name: "Impact",
      description:
        "We prioritize investments that generate both financial returns and positive social impact for Nigerian communities.",
    },
    {
      name: "Innovation",
      description:
        "We leverage cutting-edge fintech and blockchain technology to deliver seamless, transparent investment experiences.",
    },
  ],
};

export const investmentRanges = {
  typical: {
    min: 500000,
    max: 5000000,
    currency: "NGN",
    description: "Based on diaspora investor survey data (2025)",
    note: "Approximately 68% of survey respondents indicated willingness to invest within this range",
  },
  source: "Pew Research, 2024",
};
