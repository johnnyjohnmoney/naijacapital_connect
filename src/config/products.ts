/**
 * NaijaConnect Capital Products and Services
 * Source: Official Business Plan December 2025
 */

import {
  ArrowPathIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pricing: {
    amount: string;
    period?: string;
    note?: string;
  };
  features: string[];
  icon: any;
  order: number;
}

export const products: Product[] = [
  {
    id: "remitconnect",
    name: "RemitConnect",
    tagline: "Low-Cost Remittance Gateway",
    description:
      "A payment channel that allows direct transfers from Nigerian expatriates to approved investment wallets. It uses blockchain for tracking and provides smooth cross-border transfers with excellent exchange rates.",
    pricing: {
      amount: "2.0%",
      period: "per transaction",
      note: "Below industry average of 4-6%",
    },
    features: [
      "Direct diaspora-to-investment transfers",
      "Blockchain transaction tracking",
      "Competitive exchange rates below industry average",
      "Secure, encrypted transactions",
      "24/7 availability",
      "Real-time transfer notifications",
    ],
    icon: ArrowPathIcon,
    order: 1,
  },
  {
    id: "investdirect",
    name: "InvestDirect",
    tagline: "Curated Investment Marketplace",
    description:
      "A digital marketplace that gives access to selected investment projects in agriculture, real estate, and small businesses. All projects are screened for financial viability, operational excellence, and governance quality.",
    pricing: {
      amount: "2%",
      period: "annually",
      note: "Platform service fee charged monthly on assets under management (AUM)",
    },
    features: [
      "Pre-vetted investment opportunities",
      "Diversified sectors: Agriculture, Real Estate, SMEs, Infrastructure",
      "Thorough due diligence and financial screening",
      "Direct investment into Nigerian ventures",
      "Transparent project documentation",
      "Monthly portfolio reporting",
    ],
    icon: ShoppingBagIcon,
    order: 2,
  },
  {
    id: "impacttrack",
    name: "ImpactTrack Dashboard",
    tagline: "Free Investment Monitoring",
    description:
      "A comprehensive tool for tracking investments that offers real-time project updates, return on investment calculations, and social impact statistics. Monitor your portfolio performance and see the tangible impact of your investments on Nigerian communities.",
    pricing: {
      amount: "Free",
      period: "",
      note: "Included for all registered investors",
    },
    features: [
      "Real-time portfolio performance tracking",
      "ROI calculations and projections",
      "Social impact metrics and reporting",
      "Project milestone updates",
      "Financial performance dashboards",
      "Impact visualization tools",
    ],
    icon: ChartBarIcon,
    order: 3,
  },
  {
    id: "learning-hub",
    name: "Diaspora Learning Hub",
    tagline: "Financial Education & Training",
    description:
      "A portal for financial education and investment training, featuring expert-led webinars, market reports, and personalized advisory services. Gain the knowledge needed to make informed investment decisions in the Nigerian market.",
    pricing: {
      amount: "₦5,000",
      period: "per course or subscription",
      note: "Premium access with certificate programs available",
    },
    features: [
      "Expert-led investment webinars",
      "Nigerian market research reports",
      "Personalized investment advisory",
      "Financial literacy courses",
      "Regulatory compliance training",
      "Community forum access",
    ],
    icon: AcademicCapIcon,
    order: 4,
  },
];

export const productCategories = [
  {
    id: "remittance",
    name: "Remittance Services",
    products: ["remitconnect"],
  },
  {
    id: "investment",
    name: "Investment Platforms",
    products: ["investdirect", "impacttrack"],
  },
  {
    id: "education",
    name: "Education & Training",
    products: ["learning-hub"],
  },
];

export const investmentSectors = [
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Farming, agro-processing, and food security projects",
    icon: "🌾",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Residential and commercial property development",
    icon: "🏢",
  },
  {
    id: "sme",
    name: "Small & Medium Enterprises",
    description: "Growing businesses across various industries",
    icon: "🏪",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Essential services and utilities development",
    icon: "🏗️",
  },
];

export const pricingComparison = {
  remittance: {
    naijaconnect: "2.0%",
    industry: "4-6%",
    savings: "50-67%",
  },
  management: {
    naijaconnect: "2% annually",
    traditional: "3-5% annually",
    note: "Competitive with international wealth management platforms",
  },
};
