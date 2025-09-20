"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface Investment {
  id: string;
  amount: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  investor?: {
    id: string;
    name: string;
    email: string;
  };
  business: {
    id: string;
    title: string;
    industry: string;
    expectedROI: number;
    timeline: number;
    riskLevel: string;
    status: string;
    owner: {
      name: string;
    };
  };
  returns: {
    id: string;
    amount: number;
    description: string;
    createdAt: string;
  }[];
}

interface InvestmentSummary {
  totalInvested: number;
  totalReturns: number;
  totalValue: number;
  activeInvestments: number;
}

interface InvestmentManagementProps {
  userRole: "INVESTOR" | "BUSINESS_OWNER" | "ADMINISTRATOR";
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case "ACTIVE":
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case "COMPLETED":
      return <BanknotesIcon className="h-5 w-5 text-blue-500" />;
    case "CANCELLED":
      return <XMarkIcon className="h-5 w-5 text-red-500" />;
    default:
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const baseClasses =
    "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
  switch (status) {
    case "PENDING":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case "ACTIVE":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "COMPLETED":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "CANCELLED":
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export default function InvestmentManagement({
  userRole,
}: InvestmentManagementProps) {
  const { data: session } = useSession();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const statusOptions = [
    { value: "ALL", label: "All Investments" },
    { value: "PENDING", label: "Pending" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const statusParam =
        selectedStatus !== "ALL" ? `?status=${selectedStatus}` : "";

      // Use different endpoints based on user role
      const endpoint =
        userRole === "BUSINESS_OWNER"
          ? `/api/investments/business${statusParam}`
          : `/api/investments${statusParam}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }

      const data = await response.json();
      setInvestments(data.investments);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchInvestments();
    }
  }, [session, selectedStatus]);

  const handleStatusUpdate = async (
    investmentId: string,
    newStatus: string,
    note?: string
  ) => {
    try {
      setUpdatingStatus(investmentId);
      const response = await fetch(`/api/investments/${investmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, note }),
      });

      if (!response.ok) {
        throw new Error("Failed to update investment status");
      }

      // Refresh investments
      await fetchInvestments();
      alert("Investment status updated successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCancelInvestment = async (investmentId: string) => {
    if (!confirm("Are you sure you want to cancel this investment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/investments/${investmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel investment");
      }

      await fetchInvestments();
      alert("Investment cancelled successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel investment");
    }
  };

  const calculateInvestmentPerformance = (investment: Investment) => {
    const totalReturns = investment.returns.reduce(
      (sum, ret) => sum + ret.amount,
      0
    );
    const currentValue = investment.amount + totalReturns;
    const roi =
      investment.amount > 0 ? (totalReturns / investment.amount) * 100 : 0;

    return {
      totalReturns,
      currentValue,
      roi,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BanknotesIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Invested
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.totalInvested)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Returns
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.totalReturns)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Portfolio Value
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.totalValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {userRole === "BUSINESS_OWNER"
                    ? "Pending Investments"
                    : "Active Investments"}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userRole === "BUSINESS_OWNER"
                    ? (summary as any).pendingInvestments ||
                      summary.activeInvestments
                    : summary.activeInvestments}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Investment Management
            </h3>
            <div className="flex items-center gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Investments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {userRole === "BUSINESS_OWNER" ? "Investor" : "Business"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {investments.map((investment) => {
                const performance = calculateInvestmentPerformance(investment);

                return (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {userRole === "BUSINESS_OWNER"
                          ? (investment as any).investor?.name ||
                            "Unknown Investor"
                          : investment.business.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {userRole === "BUSINESS_OWNER"
                          ? `${investment.business.title} • ${investment.business.industry}`
                          : `${investment.business.industry} • ${investment.business.owner.name}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(investment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Value: {formatCurrency(performance.currentValue)}
                      </div>
                      <div
                        className={`text-sm ${
                          performance.roi >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ROI: {performance.roi.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(investment.status)}
                        <span
                          className={`ml-2 ${getStatusBadge(
                            investment.status
                          )}`}
                        >
                          {investment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(investment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInvestment(investment);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>

                      {/* Cancel button for pending investments */}
                      {userRole === "INVESTOR" &&
                        investment.status === "PENDING" && (
                          <button
                            onClick={() =>
                              handleCancelInvestment(investment.id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}

                      {/* Status update buttons for business owners and admins */}
                      {(userRole === "BUSINESS_OWNER" ||
                        userRole === "ADMINISTRATOR") &&
                        investment.status === "PENDING" && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() =>
                                handleStatusUpdate(investment.id, "ACTIVE")
                              }
                              disabled={updatingStatus === investment.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  investment.id,
                                  "CANCELLED",
                                  "Rejected by business owner"
                                )
                              }
                              disabled={updatingStatus === investment.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {investments.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No investments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStatus === "ALL"
                ? "You haven't made any investments yet."
                : `No investments with ${selectedStatus.toLowerCase()} status.`}
            </p>
          </div>
        )}
      </div>

      {/* Investment Detail Modal */}
      {showDetailModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Investment Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Business Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Business Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900">
                    {selectedInvestment.business.title}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Industry: {selectedInvestment.business.industry}
                  </p>
                  <p className="text-sm text-gray-600">
                    Owner: {selectedInvestment.business.owner.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expected ROI: {selectedInvestment.business.expectedROI}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Timeline: {selectedInvestment.business.timeline} months
                  </p>
                </div>
              </div>

              {/* Investment Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Investment Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Investment Amount</p>
                    <p className="font-medium">
                      {formatCurrency(selectedInvestment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={getStatusBadge(selectedInvestment.status)}>
                      {selectedInvestment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Investment Date</p>
                    <p className="font-medium">
                      {new Date(
                        selectedInvestment.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(
                        selectedInvestment.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Returns History */}
              {selectedInvestment.returns.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Returns History
                  </h4>
                  <div className="space-y-2">
                    {selectedInvestment.returns.map((returnItem) => (
                      <div
                        key={returnItem.id}
                        className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {returnItem.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              returnItem.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          +{formatCurrency(returnItem.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
