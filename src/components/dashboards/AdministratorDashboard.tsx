"use client";

import { useState, useEffect } from "react";
import InvestmentManagement from "@/components/InvestmentManagement";
import { LineChart, BarChart, PieChart, DonutChart } from "@/components/charts";
import {
  calculatePlatformMetrics,
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  type PlatformMetrics,
  type MonthlyTrend,
} from "@/lib/analytics";
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Mock data for demonstration
const platformStats = {
  totalUsers: 2847,
  totalBusinesses: 156,
  totalInvestments: 47,
  totalVolume: 89500000,
  pendingApprovals: 12,
  activeReports: 3,
};

const pendingApprovals = [
  {
    id: 1,
    type: "Business",
    name: "Lagos Tech Hub",
    submittedBy: "Adebayo Okunola",
    submittedAt: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    type: "Investment",
    name: "Series A Funding - ₦50M",
    submittedBy: "TechCorp Ltd",
    submittedAt: "2024-01-14",
    status: "pending",
  },
  {
    id: 3,
    type: "User Verification",
    name: "Sarah Johnson",
    submittedBy: "Self-verification",
    submittedAt: "2024-01-13",
    status: "pending",
  },
];

const recentReports = [
  {
    id: 1,
    type: "Fraud Report",
    reportedBy: "Michael Chen",
    target: "Green Energy Solutions",
    priority: "High",
    status: "Investigating",
    date: "2024-01-15",
  },
  {
    id: 2,
    type: "Inappropriate Content",
    reportedBy: "Anonymous",
    target: "Investment Listing #4521",
    priority: "Medium",
    status: "Under Review",
    date: "2024-01-14",
  },
];

const systemAlerts = [
  {
    id: 1,
    type: "Security",
    message: "Multiple failed login attempts detected for user ID 4521",
    severity: "High",
    timestamp: "2024-01-15 14:30",
  },
  {
    id: 2,
    type: "Performance",
    message: "Database query response time above threshold",
    severity: "Medium",
    timestamp: "2024-01-15 13:45",
  },
  {
    id: 3,
    type: "Compliance",
    message: "KYC verification rate below 95% for the last 7 days",
    severity: "Low",
    timestamp: "2024-01-15 10:15",
  },
];

export default function AdministratorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [platformMetrics, setPlatformMetrics] =
    useState<PlatformMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for platform analytics
  useEffect(() => {
    // Simulate API call to fetch platform data
    const mockUsers = Array.from({ length: 2847 }, (_, i) => ({ id: i }));
    const mockBusinesses = Array.from({ length: 156 }, (_, i) => ({ id: i }));
    const mockInvestments = Array.from({ length: 47 }, (_, i) => ({
      id: i,
      amount: Math.floor(Math.random() * 5000000) + 100000,
      status: ["ACTIVE", "PENDING", "CANCELLED"][Math.floor(Math.random() * 3)],
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));

    const metrics = calculatePlatformMetrics(
      mockUsers,
      mockBusinesses,
      mockInvestments
    );
    setPlatformMetrics(metrics);
    setIsLoading(false);
  }, []);

  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "analytics", name: "Platform Analytics", icon: ClockIcon },
    { id: "investments", name: "Investments", icon: BanknotesIcon },
    { id: "approvals", name: "Approvals", icon: CheckBadgeIcon },
    { id: "reports", name: "Reports", icon: ExclamationTriangleIcon },
    { id: "users", name: "User Management", icon: UserGroupIcon },
    { id: "system", name: "System Health", icon: ClockIcon },
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
          icon={UserGroupIcon}
          title="Total Users"
          value={platformStats.totalUsers.toLocaleString()}
          change="+12%"
        />
        <StatCard
          icon={BuildingOfficeIcon}
          title="Active Businesses"
          value={platformStats.totalBusinesses}
          change="+8%"
        />
        <StatCard
          icon={BanknotesIcon}
          title="Total Investments"
          value={platformStats.totalInvestments}
          change="+15%"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Investment Volume"
          value={formatCurrency(platformStats.totalVolume)}
          change="+23%"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              Approve Pending Items ({platformStats.pendingApprovals})
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Review Reports ({platformStats.activeReports})
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              System Health Check
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Generate Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent System Alerts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent System Alerts
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === "High"
                    ? "border-red-400 bg-red-50"
                    : alert.severity === "Medium"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-blue-400 bg-blue-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.type}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">{alert.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlatformAnalytics = () => {
    if (isLoading || !platformMetrics) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Platform Growth Metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Platform Growth Analytics
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Growth Trends */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Monthly Platform Growth
              </h4>
              <LineChart
                data={
                  platformMetrics.monthlyTrends &&
                  platformMetrics.monthlyTrends.length > 0
                    ? platformMetrics.monthlyTrends.map((trend) => ({
                        date: trend.month.slice(-2),
                        value: trend.newUsers || 0,
                      }))
                    : [
                        {
                          date: new Date().toISOString().slice(5, 10).slice(-2),
                          value: 0,
                        },
                      ]
                }
                width={500}
                height={250}
                color="#059669"
              />
            </div>

            {/* Investment Volume Trends */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Investment Volume Trends
              </h4>
              <LineChart
                data={
                  platformMetrics.monthlyTrends &&
                  platformMetrics.monthlyTrends.length > 0
                    ? platformMetrics.monthlyTrends.map((trend) => ({
                        date: trend.month.slice(-2),
                        value: (trend.investmentVolume || 0) / 1000000, // Convert to millions
                      }))
                    : [
                        {
                          date: new Date().toISOString().slice(5, 10).slice(-2),
                          value: 0,
                        },
                      ]
                }
                width={500}
                height={250}
                color="#0891b2"
              />
            </div>
          </div>
        </div>

        {/* Platform Performance KPIs */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Key Performance Indicators
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(platformMetrics.platformGrowthRate)}
              </div>
              <div className="text-sm text-gray-600">Platform Growth Rate</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(platformMetrics.userAcquisitionRate)}
              </div>
              <div className="text-sm text-gray-600">User Acquisition Rate</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(platformMetrics.investmentSuccessRate)}
              </div>
              <div className="text-sm text-gray-600">
                Investment Success Rate
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatPercentage(platformMetrics.platformROI)}
              </div>
              <div className="text-sm text-gray-600">Platform ROI</div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Business Creation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-800 mb-4">
              Monthly Business Creation
            </h4>
            <BarChart
              data={
                platformMetrics.monthlyTrends &&
                platformMetrics.monthlyTrends.length > 0
                  ? platformMetrics.monthlyTrends.slice(-6).map((trend) => ({
                      label: trend.month.slice(-2),
                      value: trend.newBusinesses || 0,
                    }))
                  : [
                      {
                        label: "No Data",
                        value: 0,
                      },
                    ]
              }
              width={400}
              height={250}
              color="#7c3aed"
            />
          </div>

          {/* Investment Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-800 mb-4">
              Investment Size Distribution
            </h4>
            <PieChart
              data={[
                { label: "< ₦1M", value: 35 },
                { label: "₦1M - ₦5M", value: 45 },
                { label: "₦5M - ₦10M", value: 15 },
                { label: "> ₦10M", value: 5 },
              ]}
              size={300}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderApprovals = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingApprovals.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.submittedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.submittedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-900">
                      <CheckBadgeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentReports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.reportedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.target}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : report.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Administrator Dashboard
          </h1>
          <p className="text-gray-600">Platform management and oversight</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "analytics" && renderPlatformAnalytics()}
          {activeTab === "investments" && (
            <InvestmentManagement userRole="ADMINISTRATOR" />
          )}
          {activeTab === "approvals" && renderApprovals()}
          {activeTab === "reports" && renderReports()}
          {activeTab === "users" && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                User Management interface coming soon...
              </p>
            </div>
          )}
          {activeTab === "system" && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                System Health monitoring coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
