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
  description: string;
  detailedPlan: string;
  targetCapital: number;
  minimumInvestment: number;
  expectedROI: number;
  timeline: number;
  industry: string;
  riskLevel: string;
  status: string;
  currentRaised: number;
  createdAt: string;
  adminNotes?: string;
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

interface PendingInvestor {
  id: string;
  investorId: string;
  opportunityId: string;
  amount?: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  investor: {
    id: string;
    name?: string;
    email?: string;
    profile?: {
      experience?: string;
      investmentPreference?: string;
    };
  };
  opportunity?: {
    id: string;
    title: string;
    targetCapital: number;
  };
}

const calculateProgress = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100);
};

export default function BusinessOwnerDashboard({ user }: { user: any }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [showInvestorManagement, setShowInvestorManagement] = useState(false);
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
  const [pendingInvestors, setPendingInvestors] = useState<PendingInvestor[]>(
    []
  );
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
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

  // Fetch pending investors
  const fetchPendingInvestors = async () => {
    try {
      const response = await fetch("/api/investments/business?status=PENDING");

      if (!response.ok) {
        throw new Error("Failed to fetch pending investors");
      }

      const data = await response.json();
      console.log("Pending investors data:", data);
      console.log("Investments array:", data.investments);

      // Add additional validation
      const validInvestments = (data.investments || []).filter(
        (inv: any) => inv && inv.id
      );
      console.log("Valid investments:", validInvestments);

      setPendingInvestors(validInvestments);
    } catch (err) {
      console.error("Failed to fetch pending investors:", err);
      setPendingInvestors([]); // Set empty array on error
    }
  };

  // Handle investor approval/rejection
  const handleInvestorDecision = async (
    investmentId: string,
    decision: "APPROVED" | "REJECTED"
  ) => {
    try {
      console.log(
        `Attempting to ${decision.toLowerCase()} investment:`,
        investmentId
      );

      // Map UI decisions to API status values
      const statusMap = {
        APPROVED: "ACTIVE",
        REJECTED: "CANCELLED",
      };

      const apiStatus = statusMap[decision];
      console.log(`Mapping ${decision} to API status: ${apiStatus}`);

      const response = await fetch(`/api/investments/${investmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: apiStatus }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        // Try to get more detailed error information
        let errorMessage = `Failed to ${decision.toLowerCase()} investment`;
        try {
          const errorData = await response.text();
          console.log("Error response body:", errorData);
          errorMessage += ` (Status: ${response.status})`;
          if (errorData) {
            errorMessage += ` - ${errorData}`;
          }
        } catch (parseError) {
          console.log("Could not parse error response");
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Success response data:", responseData);

      // Refresh data after decision
      await fetchPendingInvestors();
      await fetchInvestorAnalytics();

      // Show success message
      setNotification({
        type: "success",
        message: `Investment ${decision.toLowerCase()} successfully!`,
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error(`Failed to ${decision.toLowerCase()} investment:`, err);

      // More user-friendly error message
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setNotification({
        type: "error",
        message: `Failed to ${decision.toLowerCase()} investment: ${errorMessage}`,
      });

      // Auto-hide notification after 8 seconds for errors
      setTimeout(() => setNotification(null), 8000);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchInvestorAnalytics();
    fetchPendingInvestors();
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

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            {notification.type === "success" ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="ml-3 flex-1">
              <p
                className={`text-sm font-medium ${
                  notification.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {notification.type === "success" ? "Success" : "Error"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  notification.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`ml-4 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                notification.type === "success"
                  ? "text-green-500 hover:bg-green-100 focus:ring-green-600"
                  : "text-red-500 hover:bg-red-100 focus:ring-red-600"
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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
                      <button
                        onClick={() => setShowInvestorManagement(true)}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
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

              {/* Opportunities Tab */}
              {activeTab === "opportunities" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        My Opportunities
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage your business opportunities and track investment
                        progress
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create New Opportunity
                    </button>
                  </div>

                  {opportunities.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No opportunities yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating your first investment
                        opportunity.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <PlusIcon className="h-5 w-5 mr-2" />
                          Create Opportunity
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {opportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="bg-white rounded-lg shadow overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {opportunity.title}
                                  </h3>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      opportunity.status === "APPROVED"
                                        ? "bg-green-100 text-green-800"
                                        : opportunity.status ===
                                          "PENDING_REVIEW"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : opportunity.status ===
                                          "NEEDS_REVISION"
                                        ? "bg-orange-100 text-orange-800"
                                        : opportunity.status === "REJECTED"
                                        ? "bg-red-100 text-red-800"
                                        : opportunity.status === "SUSPENDED"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {opportunity.status.replace(/_/g, " ")}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                  {opportunity.description}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Target Capital
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {formatCurrency(
                                        opportunity.targetCapital
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Raised
                                    </p>
                                    <p className="text-sm font-semibold text-green-600">
                                      {formatCurrency(
                                        opportunity.currentRaised || 0
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Investors
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {opportunity._count?.investments || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Industry
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                      {opportunity.industry}
                                    </p>
                                  </div>
                                </div>

                                {/* Funding Progress Bar */}
                                <div className="mb-4">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Funding Progress</span>
                                    <span>
                                      {formatPercentage(
                                        ((opportunity.currentRaised || 0) /
                                          opportunity.targetCapital) *
                                          100
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(
                                          ((opportunity.currentRaised || 0) /
                                            opportunity.targetCapital) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {opportunity.adminNotes && (
                                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-xs font-medium text-yellow-800 mb-1">
                                      Admin Notes:
                                    </p>
                                    <p className="text-sm text-yellow-700">
                                      {opportunity.adminNotes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200">
                              <Link
                                href={`/opportunities/${opportunity.id}`}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                View Details
                              </Link>

                              {(opportunity.status === "PENDING_REVIEW" ||
                                opportunity.status === "NEEDS_REVISION") && (
                                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                  Edit
                                </button>
                              )}

                              {opportunity._count?.investments === 0 &&
                                (opportunity.status === "PENDING_REVIEW" ||
                                  opportunity.status === "NEEDS_REVISION" ||
                                  opportunity.status === "REJECTED") && (
                                  <button className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Delete
                                  </button>
                                )}

                              {opportunity._count?.investments > 0 &&
                                (opportunity.status === "APPROVED" ||
                                  opportunity.status === "OPEN") && (
                                  <button className="inline-flex items-center px-3 py-1.5 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                    Request Cancellation
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Investment Management Tab */}
              {activeTab === "investments" && (
                <InvestmentManagement userRole="BUSINESS_OWNER" />
              )}

              {/* Education Tab */}
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

      {/* Investor Management Modal */}
      {showInvestorManagement && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowInvestorManagement(false)}
            />

            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={() => setShowInvestorManagement(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Investor Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Review and approve investor applications for your
                      opportunities
                    </p>
                  </div>

                  {/* Pending Investors List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {pendingInvestors.length === 0 ? (
                      <div className="text-center py-8">
                        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No pending investors
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          All investor applications have been reviewed.
                        </p>
                      </div>
                    ) : (
                      pendingInvestors.map((investor) => (
                        <div
                          key={investor.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-white">
                                    {investor.investor?.name?.charAt(0) || "?"}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {investor.investor?.name ||
                                      "Unknown Investor"}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {investor.investor?.email ||
                                      "No email provided"}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Investment Amount:
                                  </span>
                                  <p className="text-green-600 font-semibold">
                                    {formatCurrency(investor.amount || 0)}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Opportunity:
                                  </span>
                                  <p className="text-gray-900">
                                    {investor.opportunity?.title || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Applied:
                                  </span>
                                  <p className="text-gray-600">
                                    {investor.createdAt
                                      ? new Date(
                                          investor.createdAt
                                        ).toLocaleDateString()
                                      : "Unknown date"}
                                  </p>
                                </div>
                              </div>

                              {investor.investor.profile && (
                                <div className="mt-3 text-sm">
                                  {investor.investor.profile.experience && (
                                    <div className="mb-2">
                                      <span className="font-medium text-gray-700">
                                        Experience:
                                      </span>
                                      <p className="text-gray-600">
                                        {investor.investor.profile.experience}
                                      </p>
                                    </div>
                                  )}
                                  {investor.investor.profile
                                    .investmentPreference && (
                                    <div>
                                      <span className="font-medium text-gray-700">
                                        Investment Preference:
                                      </span>
                                      <p className="text-gray-600">
                                        {
                                          investor.investor.profile
                                            .investmentPreference
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                              <button
                                onClick={() =>
                                  handleInvestorDecision(
                                    investor.id,
                                    "APPROVED"
                                  )
                                }
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleInvestorDecision(
                                    investor.id,
                                    "REJECTED"
                                  )
                                }
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <svg
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => setShowInvestorManagement(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
