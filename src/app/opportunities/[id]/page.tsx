"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import InvestmentModal from "@/components/InvestmentModal";
import {
  ArrowLeftIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

// Mock data for demonstration
const mockOpportunityDetails = {
  "1": {
    id: "1",
    ownerId: "business_owner_1", // Business owner ID for ownership check
    title: "Lagos Tech Innovation Hub",
    description:
      "A cutting-edge technology hub in Lagos focused on supporting startups and fostering innovation in Nigeria's tech ecosystem. This project aims to create a world-class facility that will house over 100 startups, provide mentorship programs, and offer state-of-the-art technology infrastructure.",
    targetCapital: 50000000,
    minimumInvestment: 500000,
    currentRaised: 32000000,
    expectedROI: 18,
    timeline: 24,
    industry: "Technology",
    riskLevel: "Medium",
    status: "OPEN",
    owner: {
      name: "TechVentures Nigeria Ltd",
      description:
        "Leading technology investment company with 10+ years experience in the Nigerian tech ecosystem.",
      founded: "2014",
      employees: "50-100",
    },
    _count: {
      investments: 45,
    },
    businessPlan: {
      overview:
        "The Lagos Tech Innovation Hub will serve as a catalyst for technology innovation in West Africa, providing entrepreneurs with the resources, mentorship, and infrastructure needed to build successful technology companies.",
      marketOpportunity:
        "Nigeria's tech sector is experiencing unprecedented growth, with over $1.2B in funding raised in 2023. There is a significant gap in quality incubation facilities and our hub will address this need.",
      revenueModel:
        "Revenue will be generated through office space rentals, equity stakes in incubated startups, consulting services, and event hosting.",
      financialProjections:
        "Expected to achieve profitability by month 18, with projected annual revenue of ₦15B by year 3.",
    },
    keyMetrics: [
      { label: "Expected Break-even", value: "18 months" },
      { label: "Projected Annual Revenue", value: "₦15B by Year 3" },
      { label: "Number of Startups", value: "100+ companies" },
      { label: "Job Creation", value: "500+ direct jobs" },
    ],
    risks: [
      "Regulatory changes in the technology sector",
      "Economic downturns affecting startup funding",
      "Competition from other tech hubs",
      "Delays in construction or infrastructure development",
    ],
    documents: [
      { name: "Business Plan", size: "2.3 MB", type: "PDF" },
      { name: "Financial Projections", size: "1.8 MB", type: "Excel" },
      { name: "Legal Documentation", size: "3.1 MB", type: "PDF" },
      { name: "Market Analysis", size: "2.7 MB", type: "PDF" },
    ],
  },
  "2": {
    id: "2",
    ownerId: "business_owner_2", // Business owner ID for ownership check
    title: "Organic Farm Investment",
    description:
      "Sustainable organic farming operation in Ogun State producing premium crops for local and export markets.",
    targetCapital: 25000000,
    minimumInvestment: 250000,
    currentRaised: 18000000,
    expectedROI: 22,
    timeline: 36,
    industry: "Agriculture",
    riskLevel: "Low",
    status: "OPEN",
    owner: {
      name: "GreenGrow Farms Ltd",
      description:
        "Sustainable agriculture company focused on organic farming and export.",
      founded: "2018",
      employees: "20-50",
    },
    _count: {
      investments: 32,
    },
  },
  "3": {
    id: "3",
    ownerId: "business_owner_3", // Business owner ID for ownership check
    title: "Renewable Energy Project",
    description:
      "Solar power installation project serving rural communities in Northern Nigeria with clean, sustainable energy.",
    targetCapital: 75000000,
    minimumInvestment: 1000000,
    currentRaised: 45000000,
    expectedROI: 15,
    timeline: 30,
    industry: "Energy",
    riskLevel: "Low",
    status: "OPEN",
    owner: {
      name: "SolarWorks Nigeria",
      description: "Leading renewable energy company in Nigeria.",
      founded: "2016",
      employees: "100+",
    },
    _count: {
      investments: 28,
    },
  },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateProgress = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100);
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [showInvestModal, setShowInvestModal] = useState(false);

  const opportunityId = params.id as string;
  const opportunity =
    mockOpportunityDetails[
      opportunityId as keyof typeof mockOpportunityDetails
    ];

  useEffect(() => {
    if (!opportunity) {
      router.push("/opportunities");
    }
  }, [opportunity, router]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Opportunity not found</p>
          <Link
            href="/opportunities"
            className="text-green-600 hover:text-green-500 mt-2 inline-block"
          >
            ← Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = calculateProgress(
    opportunity.currentRaised,
    opportunity.targetCapital
  );

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "business-plan", name: "Business Plan" },
    { id: "financials", name: "Financials" },
    { id: "documents", name: "Documents" },
  ];

  const handleInvest = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setShowInvestModal(true);
  };

  const handleInvestmentSubmit = async (investmentData: {
    amount: number;
    opportunityId: string;
  }) => {
    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: investmentData.amount,
          businessId: investmentData.opportunityId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit investment");
      }

      const result = await response.json();
      alert(
        `Investment of ${formatCurrency(
          investmentData.amount
        )} submitted successfully! Status: ${result.investment.status}`
      );

      // Optionally refresh the page to show updated investment data
      window.location.reload();
    } catch (error) {
      console.error("Investment submission failed:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/opportunities"
                className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back to Opportunities
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  opportunity.riskLevel === "Low"
                    ? "bg-green-100 text-green-800"
                    : opportunity.riskLevel === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {opportunity.riskLevel} Risk
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {opportunity.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Opportunity Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {opportunity.title}
              </h1>
              <p className="text-gray-600 mb-4">{opportunity.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Target Capital</div>
                  <div className="font-semibold">
                    {formatCurrency(opportunity.targetCapital)}
                  </div>
                </div>
                <div className="text-center">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Expected ROI</div>
                  <div className="font-semibold">
                    {opportunity.expectedROI}%
                  </div>
                </div>
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Timeline</div>
                  <div className="font-semibold">
                    {opportunity.timeline} months
                  </div>
                </div>
                <div className="text-center">
                  <UserGroupIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Investors</div>
                  <div className="font-semibold">
                    {opportunity._count.investments}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About the Company
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Company</div>
                            <div className="font-medium">
                              {opportunity.owner.name}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Founded</div>
                            <div className="font-medium">
                              {opportunity.owner.founded || "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Employees
                            </div>
                            <div className="font-medium">
                              {opportunity.owner.employees || "N/A"}
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-gray-600">
                          {opportunity.owner.description}
                        </p>
                      </div>
                    </div>

                    {(opportunity as any).keyMetrics && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Key Metrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(opportunity as any).keyMetrics.map(
                            (metric: any, index: number) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <div className="text-sm text-gray-500">
                                  {metric.label}
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {metric.value}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {(opportunity as any).risks && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Risk Factors
                        </h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <ul className="space-y-2">
                            {(opportunity as any).risks.map(
                              (risk: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-yellow-600 mr-2">
                                    •
                                  </span>
                                  <span className="text-gray-700">{risk}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "business-plan" &&
                  (opportunity as any).businessPlan && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Business Overview
                        </h3>
                        <p className="text-gray-600">
                          {(opportunity as any).businessPlan.overview}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Market Opportunity
                        </h3>
                        <p className="text-gray-600">
                          {(opportunity as any).businessPlan.marketOpportunity}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Revenue Model
                        </h3>
                        <p className="text-gray-600">
                          {(opportunity as any).businessPlan.revenueModel}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Financial Projections
                        </h3>
                        <p className="text-gray-600">
                          {
                            (opportunity as any).businessPlan
                              .financialProjections
                          }
                        </p>
                      </div>
                    </div>
                  )}

                {activeTab === "financials" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Investment Terms
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">
                            Minimum Investment
                          </div>
                          <div className="text-xl font-semibold text-gray-900">
                            {formatCurrency(opportunity.minimumInvestment)}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500">
                            Expected Returns
                          </div>
                          <div className="text-xl font-semibold text-green-600">
                            {opportunity.expectedROI}% annually
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Use of Funds
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">
                            Infrastructure Development
                          </span>
                          <span className="font-medium">60%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">
                            Equipment & Technology
                          </span>
                          <span className="font-medium">25%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">Working Capital</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">
                            Marketing & Operations
                          </span>
                          <span className="font-medium">5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "documents" &&
                  (opportunity as any).documents && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Available Documents
                      </h3>
                      <div className="space-y-3">
                        {(opportunity as any).documents.map(
                          (doc: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                  <span className="text-xs font-medium text-red-600">
                                    {doc.type}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {doc.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {doc.size}
                                  </div>
                                </div>
                              </div>
                              <button className="text-green-600 hover:text-green-500 font-medium">
                                Download
                              </button>
                            </div>
                          )
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        * Some documents may require investor verification to
                        access
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Investment Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Investment Progress
              </h3>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Raised</span>
                  <span className="font-medium">
                    {formatCurrency(opportunity.currentRaised)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target</span>
                  <span className="font-medium">
                    {formatCurrency(opportunity.targetCapital)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum</span>
                  <span className="font-medium">
                    {formatCurrency(opportunity.minimumInvestment)}
                  </span>
                </div>
              </div>

              {/* Conditional Investment Button */}
              {session && session.user.role === "INVESTOR" ? (
                <button
                  onClick={handleInvest}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-500 transition-colors"
                >
                  Invest Now
                </button>
              ) : !session ? (
                <Link
                  href="/auth/signin"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-500 transition-colors text-center block"
                >
                  Login to Invest
                </Link>
              ) : session.user.role === "BUSINESS_OWNER" ? (
                <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-semibold text-center border border-gray-300">
                  <p className="text-sm">Business Owner Access</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage your opportunities in your dashboard
                  </p>
                </div>
              ) : (
                <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-semibold text-center border border-gray-300">
                  <p className="text-sm">Investment Access Restricted</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Contact support for assistance
                  </p>
                </div>
              )}
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Facts
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium">{opportunity.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-medium">{opportunity.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline</span>
                  <span className="font-medium">
                    {opportunity.timeline} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Investors</span>
                  <span className="font-medium">
                    {opportunity._count.investments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={showInvestModal}
        onClose={() => setShowInvestModal(false)}
        opportunity={{
          id: opportunity.id,
          title: opportunity.title,
          minimumInvestment: opportunity.minimumInvestment,
          expectedROI: opportunity.expectedROI,
          timeline: opportunity.timeline,
          riskLevel: opportunity.riskLevel,
          ownerId: opportunity.ownerId, // Include owner ID for ownership validation
        }}
        onInvestmentSubmit={handleInvestmentSubmit}
      />
    </div>
  );
}
