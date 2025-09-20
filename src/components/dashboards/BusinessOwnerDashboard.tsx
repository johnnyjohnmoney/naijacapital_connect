import Link from "next/link";
import { useState, useEffect } from "react";
import InvestmentManagement from "@/components/InvestmentManagement";
import OpportunityCreationModal from "@/components/OpportunityCreationModal";
import MessageComposer from "@/components/MessageComposer";
import MessageNotificationWidget from "@/components/MessageNotificationWidget";
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

export default function BusinessOwnerDashboard({ user }: { user: any }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
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
    } catch (err) {
      console.error("Failed to fetch investor analytics:", err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchInvestorAnalytics();
  }, []);

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
                  <p className="font-medium text-gray-900">Manage Investors</p>
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

          {/* Investor Interest Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Investor Interest Analytics
              </h2>
              <EyeIcon className="h-6 w-6 text-green-600" />
            </div>

            {investorMetrics ? (
              <div className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-8 w-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">
                          Total Investors
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {investorMetrics.totalInvestors}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-8 w-8 text-yellow-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-600">
                          Pending Reviews
                        </p>
                        <p className="text-2xl font-bold text-yellow-900">
                          {investorMetrics.pendingInvestments}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-600">
                          Approval Rate
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {investorMetrics.conversionRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Average Investment
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(investorMetrics.averageInvestment)}
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Interest
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {investorMetrics.totalInvestmentInterest} applications
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Investment Activity */}
                {recentInvestments.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                      Recent Investment Activity
                    </h3>
                    <div className="space-y-3">
                      {recentInvestments.map((investment) => (
                        <div
                          key={investment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                investment.status === "PENDING"
                                  ? "bg-yellow-400"
                                  : investment.status === "ACTIVE"
                                  ? "bg-green-400"
                                  : investment.status === "CANCELLED"
                                  ? "bg-red-400"
                                  : "bg-gray-400"
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {investment.investor.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {investment.business.title} •{" "}
                                {new Date(
                                  investment.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(investment.amount)}
                              </p>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  investment.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : investment.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800"
                                    : investment.status === "CANCELLED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {investment.status}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedInvestor({
                                  id: investment.investor.id,
                                  name: investment.investor.name,
                                  role: "INVESTOR",
                                });
                                setShowMessageComposer(true);
                              }}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Message investor"
                            >
                              <PaperAirplaneIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowTrendingUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No investor activity yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create opportunities to start attracting investors.
                </p>
              </div>
            )}
          </div>

          {/* Business Opportunities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Business Opportunities
              </h2>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target Capital
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {opportunities.map((opportunity) => {
                    const progress = calculateProgress(
                      opportunity.currentRaised,
                      opportunity.targetCapital
                    );

                    return (
                      <tr key={opportunity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {opportunity.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created:{" "}
                            {new Date(
                              opportunity.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(opportunity.targetCapital)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(opportunity.currentRaised)}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {progress.toFixed(1)}% funded
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {opportunity._count.investments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              opportunity.status === "FULLY_FUNDED"
                                ? "bg-green-100 text-green-800"
                                : opportunity.status === "OPEN"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {opportunity.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/opportunities/${opportunity.id}`}
                            className="text-green-600 hover:text-green-500"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {opportunities.length === 0 && (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No opportunities yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create your first investment opportunity to get started.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Create Opportunity
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Investment Management Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Investment Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Approve or manage investments in your opportunities
              </p>
            </div>
            <div className="p-6">
              <InvestmentManagement userRole="BUSINESS_OWNER" />
            </div>
          </div>
        </>
      )}

      {/* Opportunity Creation Modal */}
      {showCreateModal && (
        <OpportunityCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            // Refresh the opportunities data and investor analytics
            fetchOpportunities();
            fetchInvestorAnalytics();
            alert("Opportunity created successfully!");
          }}
        />
      )}
      {/* Message Composer Modal */}
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
