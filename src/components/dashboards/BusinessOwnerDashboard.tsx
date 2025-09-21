import Link from "next/link";
import { useState, useEffect } from "react";
import InvestmentManagement from "@/components/InvestmentManagement";
import OpportunityCreationModal from "@/components/OpportunityCreationModal";
import MessageComposer from "@/components/MessageComposer";
import MessageNotificationWidget from "@/components/MessageNotificationWidget";
import EducationalContentLibrary from "@/components/EducationalContentLibrary";
import { LineChart, BarChart, DonutChart, PieChart } from "@/components/charts";
import {
  calculateBusinessMetrics,
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  type BusinessMetrics,
  type FundingMilestone,
} from "@/lib/analytics";
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

// Interface for opportunity data
interface Opportunity {
  id: string;
  title: string;
  targetCapital: number;
  currentRaised: number;
  status: string;
  createdAt: string;
  _count: {
    investments: number;
  };
}

interface OpportunitySummary {
  totalOpportunities: number;
  totalTargetCapital: number;
  totalRaised: number;
  activeOpportunities: number;
  totalInvestors: number;
  pendingInvestments: number;
}

interface InvestorMetrics {
  totalInvestors: number;
  averageInvestment: number;
  pendingInvestments: number;
  approvedInvestments: number;
  totalInvestmentInterest: number;
  conversionRate: number;
}

interface RecentInvestment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  investor: {
    id: string;
    name: string;
    email: string;
  };
  business: {
    title: string;
  };
}

const calculateProgress = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100);
};

export default function BusinessOwnerDashboard({ user }: { user: any }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInvestor, setSelectedInvestor] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [summary, setSummary] = useState<OpportunitySummary | null>(null);
  const [investorMetrics, setInvestorMetrics] =
    useState<InvestorMetrics | null>(null);
  const [recentInvestments, setRecentInvestments] = useState<
    RecentInvestment[]
  >([]);
  const [businessMetrics, setBusinessMetrics] =
    useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch opportunities from API
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/opportunities/business");

      if (!response.ok) {
        throw new Error("Failed to fetch opportunities");
      }

      const data = await response.json();
      setOpportunities(data.opportunities);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch investor analytics and metrics
  const fetchInvestorAnalytics = async () => {
    try {
      const response = await fetch("/api/investments/business?limit=5");

      if (!response.ok) {
        throw new Error("Failed to fetch investor analytics");
      }

      const data = await response.json();
      setRecentInvestments(data.investments.slice(0, 5));

      // Calculate investor metrics
      const allInvestments = data.investments;
      const totalInvestors = new Set(
        allInvestments.map((inv: any) => inv.investor?.id)
      ).size;
      const totalAmount = allInvestments.reduce(
        (sum: number, inv: any) => sum + inv.amount,
        0
      );
      const averageInvestment =
        totalInvestors > 0 ? totalAmount / allInvestments.length : 0;
      const pendingCount = allInvestments.filter(
        (inv: any) => inv.status === "PENDING"
      ).length;
      const approvedCount = allInvestments.filter(
        (inv: any) => inv.status === "ACTIVE"
      ).length;
      const conversionRate =
        allInvestments.length > 0
          ? (approvedCount / allInvestments.length) * 100
          : 0;

      setInvestorMetrics({
        totalInvestors,
        averageInvestment,
        pendingInvestments: pendingCount,
        approvedInvestments: approvedCount,
        totalInvestmentInterest: allInvestments.length,
        conversionRate,
      });

      // Calculate business performance metrics
      const businessPerformance = calculateBusinessMetrics(
        opportunities,
        allInvestments
      );
      setBusinessMetrics(businessPerformance);
    } catch (err) {
      console.error("Failed to fetch investor analytics:", err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchInvestorAnalytics();
  }, []);

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "analytics", name: "Business Analytics" },
    { id: "opportunities", name: "Opportunities" },
    { id: "investments", name: "Investment Management" },
    { id: "education", name: "Education" },
  ];

  const stats = [
    {
      name: "Total Businesses",
      value: summary?.totalOpportunities?.toString() || "0",
      icon: DocumentTextIcon,
      change: "+1",
      changeType: "positive",
    },
    {
      name: "Total Capital Raised",
      value: summary ? formatCurrency(summary.totalRaised) : formatCurrency(0),
      icon: CurrencyDollarIcon,
      change: "+15.2%",
      changeType: "positive",
    },
    {
      name: "Active Investors",
      value: summary?.totalInvestors?.toString() || "0",
      icon: UserGroupIcon,
      change: "+12",
      changeType: "positive",
    },
    {
      name: "Pending Investments",
      value: summary?.pendingInvestments?.toString() || "0",
      icon: ArrowTrendingUpIcon,
      change: "+2",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchOpportunities}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || "Business Owner"}
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your business opportunities and track investor engagement.
            </p>
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
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.name}
                        className="bg-white rounded-lg shadow px-6 py-4"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <stat.icon
                              className="h-8 w-8 text-green-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-4 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {stat.name}
                              </dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {stat.value}
                                </div>
                                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                  {stat.change}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Quick Actions
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <PlusIcon className="h-6 w-6 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Create New Opportunity
                          </p>
                          <p className="text-sm text-gray-500">
                            Launch a new investment round
                          </p>
                        </div>
                      </button>
                      <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Upload Progress Report
                          </p>
                          <p className="text-sm text-gray-500">
                            Share business updates
                          </p>
                        </div>
                      </button>
                      <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <UserGroupIcon className="h-6 w-6 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Manage Investors
                          </p>
                          <p className="text-sm text-gray-500">
                            View investor communications
                          </p>
                        </div>
                      </button>
                      <Link
                        href="/messages"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Messages</p>
                          <p className="text-sm text-gray-500">
                            Communicate with investors
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Message Notification Widget */}
                  <MessageNotificationWidget />
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && businessMetrics && (
                <div className="space-y-8">
                  {/* Business Performance Overview */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      Business Performance Analytics
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Capital Utilization Chart */}
                      <div>
                        <h3 className="text-md font-medium text-gray-800 mb-4">
                          Capital Utilization
                        </h3>
                        <DonutChart
                          data={[
                            {
                              label: "Raised Capital",
                              value: businessMetrics.totalCapitalRaised,
                            },
                            {
                              label: "Target Remaining",
                              value: Math.max(
                                0,
                                (summary?.totalTargetCapital || 0) -
                                  businessMetrics.totalCapitalRaised
                              ),
                            },
                          ]}
                          size={300}
                          centerText={`${formatPercentage(
                            businessMetrics.capitalUtilizationRate
                          )}`}
                        />
                      </div>

                      {/* Funding Growth Over Time */}
                      <div>
                        <h3 className="text-md font-medium text-gray-800 mb-4">
                          Funding Growth Timeline
                        </h3>
                        <LineChart
                          data={
                            businessMetrics.fundingMilestones &&
                            businessMetrics.fundingMilestones.length > 0
                              ? businessMetrics.fundingMilestones.map(
                                  (milestone) => ({
                                    date: new Date(milestone.date)
                                      .toISOString()
                                      .slice(5, 10),
                                    value: milestone.cumulativeAmount || 0,
                                  })
                                )
                              : [
                                  {
                                    date: new Date().toISOString().slice(5, 10),
                                    value: 0,
                                  },
                                ]
                          }
                          width={400}
                          height={250}
                          color="#059669"
                        />
                      </div>
                    </div>

                    {/* Key Performance Metrics */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPercentage(
                            businessMetrics.capitalUtilizationRate
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Capital Utilization
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(
                            businessMetrics.averageInvestmentSize
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Avg Investment
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatPercentage(
                            businessMetrics.investorRetentionRate
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Investor Retention
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatPercentage(businessMetrics.roiDelivered)}
                        </div>
                        <div className="text-sm text-gray-600">
                          ROI Delivered
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other existing tabs content would go here */}
              {/* Opportunities Tab, Investment Management Tab, etc. */}
              {activeTab === "education" && (
                <EducationalContentLibrary userRole="BUSINESS_OWNER" />
              )}
            </div>
          </div>
        </>
      )}

      {/* Existing modals and components */}
      {showCreateModal && (
        <OpportunityCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchOpportunities();
            fetchInvestorAnalytics();
            alert("Opportunity created successfully!");
          }}
        />
      )}

      {selectedInvestor && (
        <MessageComposer
          isOpen={showMessageComposer}
          onClose={() => {
            setShowMessageComposer(false);
            setSelectedInvestor(null);
          }}
          recipientId={selectedInvestor.id}
          recipientName={selectedInvestor.name}
          recipientRole={selectedInvestor.role}
          onSuccess={() => {
            setShowMessageComposer(false);
            setSelectedInvestor(null);
          }}
        />
      )}
    </div>
  );
}
