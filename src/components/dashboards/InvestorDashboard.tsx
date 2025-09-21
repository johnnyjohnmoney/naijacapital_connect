"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import InvestmentManagement from "@/components/InvestmentManagement";
import OpportunityList from "@/components/OpportunityList";
import MessagingSystem from "@/components/MessagingSystem";
import MessageNotificationWidget from "@/components/MessageNotificationWidget";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import PortfolioExport from "@/components/PortfolioExport";
import EducationalContentLibrary from "@/components/EducationalContentLibrary";
import { LineChart, PieChart, BarChart, DonutChart } from "@/components/charts";
import {
  calculatePortfolioMetrics,
  analyzeBySector,
  generateTimeSeriesData,
  formatCurrency,
  formatPercentage,
  type Investment,
  type PerformanceMetrics,
  type SectorAnalysis,
  type TimeSeriesData,
} from "@/lib/analytics";
import {
  BanknotesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  EyeIcon,
  ArrowRightIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  CalendarIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

// Mock data for demonstration
const investorStats = {
  totalInvested: 2500000,
  totalReturns: 387500,
  activeInvestments: 8,
  portfolioValue: 2887500,
};

const portfolioData = [
  {
    id: 1,
    businessName: "Lagos Tech Hub",
    sector: "Technology",
    investmentAmount: 500000,
    currentValue: 625000,
    returnRate: 25.0,
    status: "Active",
    investmentDate: "2023-06-15",
  },
  {
    id: 2,
    businessName: "Green Energy Solutions",
    sector: "Renewable Energy",
    investmentAmount: 750000,
    currentValue: 892500,
    returnRate: 19.0,
    status: "Active",
    investmentDate: "2023-08-22",
  },
  {
    id: 3,
    businessName: "AgriTech Innovations",
    sector: "Agriculture",
    investmentAmount: 400000,
    currentValue: 480000,
    returnRate: 20.0,
    status: "Active",
    investmentDate: "2023-09-10",
  },
  {
    id: 4,
    businessName: "FinTech Solutions",
    sector: "Financial Technology",
    investmentAmount: 600000,
    currentValue: 720000,
    returnRate: 20.0,
    status: "Active",
    investmentDate: "2023-11-05",
  },
  {
    id: 5,
    businessName: "Healthcare Network",
    sector: "Healthcare",
    investmentAmount: 250000,
    currentValue: 270000,
    returnRate: 8.0,
    status: "Completed",
    investmentDate: "2023-03-12",
  },
];

const recentReturns = [
  {
    id: 1,
    businessName: "Lagos Tech Hub",
    amount: 62500,
    date: "2024-01-15",
    type: "Quarterly Return",
  },
  {
    id: 2,
    businessName: "Green Energy Solutions",
    amount: 35625,
    date: "2024-01-10",
    type: "Monthly Return",
  },
  {
    id: 3,
    businessName: "AgriTech Innovations",
    amount: 20000,
    date: "2024-01-05",
    type: "Quarterly Return",
  },
];

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [portfolioMetrics, setPortfolioMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [sectorAnalysis, setSectorAnalysis] = useState<SectorAnalysis[]>([]);
  const [performanceData, setPerformanceData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced mock data with realistic investment scenarios
  const investmentData: Investment[] = [
    {
      id: "1",
      amount: 500000,
      currentValue: 625000,
      investmentDate: "2023-06-15",
      status: "Active",
      business: {
        title: "Lagos Tech Hub",
        sector: "Technology",
      },
      returns: [
        {
          id: "r1",
          amount: 25000,
          date: "2023-09-15",
          type: "Quarterly Dividend",
        },
        {
          id: "r2",
          amount: 30000,
          date: "2023-12-15",
          type: "Quarterly Dividend",
        },
        {
          id: "r3",
          amount: 32000,
          date: "2024-03-15",
          type: "Quarterly Dividend",
        },
      ],
    },
    {
      id: "2",
      amount: 750000,
      currentValue: 892500,
      investmentDate: "2023-08-22",
      status: "Active",
      business: {
        title: "Green Energy Solutions",
        sector: "Renewable Energy",
      },
      returns: [
        { id: "r4", amount: 18750, date: "2023-11-22", type: "Monthly Return" },
        { id: "r5", amount: 19200, date: "2023-12-22", type: "Monthly Return" },
        { id: "r6", amount: 20100, date: "2024-01-22", type: "Monthly Return" },
      ],
    },
    {
      id: "3",
      amount: 400000,
      currentValue: 480000,
      investmentDate: "2023-09-10",
      status: "Active",
      business: {
        title: "AgriTech Innovations",
        sector: "Agriculture",
      },
      returns: [
        {
          id: "r7",
          amount: 20000,
          date: "2023-12-10",
          type: "Quarterly Return",
        },
        {
          id: "r8",
          amount: 22000,
          date: "2024-03-10",
          type: "Quarterly Return",
        },
      ],
    },
  ];

  useEffect(() => {
    // Calculate portfolio metrics
    const metrics = calculatePortfolioMetrics(investmentData);
    setPortfolioMetrics(metrics);

    // Calculate sector analysis
    const sectors = analyzeBySector(investmentData);
    setSectorAnalysis(sectors);

    // Generate performance time series
    const timeSeries = generateTimeSeriesData(investmentData, 12);
    setPerformanceData(timeSeries);

    setIsLoading(false);
  }, []);

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "analytics", name: "Analytics" },
    { id: "calculator", name: "Investment Calculator" },
    { id: "portfolio", name: "Portfolio" },
    { id: "export", name: "Export Portfolio" },
    { id: "education", name: "Education" },
    { id: "opportunities", name: "New Opportunities" },
    { id: "messages", name: "Messages" },
    { id: "returns", name: "Returns" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
    color = "green",
  }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`font-medium text-${color}-600`}>{change}</span>
            <span className="text-gray-500"> from last month</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BanknotesIcon}
          title="Total Invested"
          value={formatCurrency(investorStats.totalInvested)}
          change="+15%"
        />
        <StatCard
          icon={ArrowTrendingUpIcon}
          title="Total Returns"
          value={formatCurrency(investorStats.totalReturns)}
          change="+12%"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Active Investments"
          value={investorStats.activeInvestments}
          change="+2"
        />
        <StatCard
          icon={BuildingOfficeIcon}
          title="Portfolio Value"
          value={formatCurrency(investorStats.portfolioValue)}
          change="+18%"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/opportunities"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Investment
            </Link>
            <Link
              href="/opportunities"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Opportunities
            </Link>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Message Notification Widget */}
      <MessageNotificationWidget />

      {/* Recent Returns */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Returns</h3>
          <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentReturns.map((returnItem) => (
              <div
                key={returnItem.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {returnItem.businessName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {returnItem.type} • {returnItem.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    +{formatCurrency(returnItem.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => <InvestmentManagement userRole="INVESTOR" />;

  const renderOpportunities = () => (
    <OpportunityList
      showSearch={true}
      limit={6}
      showPagination={false}
      title="Investment Opportunities"
      description="Discover and invest in new opportunities"
      compact={true}
    />
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Messages</h3>
          </div>
          <Link
            href="/messages"
            className="text-sm text-green-600 hover:text-green-700 flex items-center"
          >
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <MessagingSystem compact={true} />
      </div>
    </div>
  );

  const renderAnalytics = () => {
    if (isLoading || !portfolioMetrics) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Portfolio Performance Analytics
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Portfolio Value Over Time
              </h4>
              <LineChart
                data={
                  performanceData && performanceData.length > 0
                    ? performanceData.map((d) => ({
                        date: d.date,
                        value: (d.portfolioValue || 0) + (d.totalReturns || 0),
                      }))
                    : [
                        {
                          date: new Date().toISOString().slice(5, 10),
                          value: 0,
                        },
                      ]
                }
                width={500}
                height={250}
                color="#059669"
              />
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Sector Distribution
              </h4>
              <PieChart
                data={
                  sectorAnalysis && sectorAnalysis.length > 0
                    ? sectorAnalysis.map((sector) => ({
                        label: sector.sector,
                        value: sector.percentage || 0,
                      }))
                    : [
                        {
                          label: "No Data",
                          value: 100,
                        },
                      ]
                }
                size={300}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReturns = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Returns History</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentReturns.map((returnItem) => (
            <div
              key={returnItem.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {returnItem.businessName}
                </p>
                <p className="text-sm text-gray-500">{returnItem.type}</p>
                <p className="text-xs text-gray-400">{returnItem.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">
                  +{formatCurrency(returnItem.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Investor Dashboard
          </h1>
          <p className="text-gray-600">
            Track your investments and discover new opportunities
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "calculator" && <InvestmentCalculator />}
          {activeTab === "portfolio" && renderPortfolio()}
          {activeTab === "export" && (
            <PortfolioExport
              portfolioData={portfolioData}
              performanceMetrics={portfolioMetrics}
              sectorAnalysis={sectorAnalysis}
              returnHistory={recentReturns}
            />
          )}
          {activeTab === "education" && (
            <EducationalContentLibrary userRole="INVESTOR" />
          )}
          {activeTab === "opportunities" && renderOpportunities()}
          {activeTab === "messages" && renderMessages()}
          {activeTab === "returns" && renderReturns()}
        </div>
      </div>
    </div>
  );
}
