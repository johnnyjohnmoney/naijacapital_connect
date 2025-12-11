"use client";

import { useState, useEffect } from "react";

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestDate: Date;
  approvedAt?: Date | null;
  transactionId?: string | null;
  adminNotes?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface FinancialStats {
  withdrawals: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    pendingAmount: number;
    approvedAmount: number;
  };
  investments: {
    total: number;
    active: number;
    completed: number;
    totalVolume: number;
  };
}

export default function FinancialOversightPanel() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: "approve" | "reject" | null;
    withdrawalId: string | null;
  }>({ type: null, withdrawalId: null });
  const [actionForm, setActionForm] = useState({
    transactionId: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [currentPage, statusFilter]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/financial/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/withdrawals?${params}`);
      if (!response.ok) throw new Error("Failed to fetch withdrawals");

      const data = await response.json();
      setWithdrawals(data.withdrawals);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      alert("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    if (!actionForm.transactionId) {
      alert("Transaction ID is required");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/withdrawals/${withdrawalId}/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: actionForm.transactionId,
            notes: actionForm.notes,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to approve withdrawal");
      }

      alert("Withdrawal approved successfully");
      setActionModal({ type: null, withdrawalId: null });
      setActionForm({ transactionId: "", reason: "", notes: "" });
      fetchWithdrawals();
      fetchStats();
    } catch (error: any) {
      console.error("Error approving withdrawal:", error);
      alert(error.message || "Failed to approve withdrawal");
    }
  };

  const handleReject = async (withdrawalId: string) => {
    if (!actionForm.reason || actionForm.reason.length < 10) {
      alert("Rejection reason must be at least 10 characters");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/withdrawals/${withdrawalId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: actionForm.reason,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reject withdrawal");
      }

      alert("Withdrawal rejected successfully");
      setActionModal({ type: null, withdrawalId: null });
      setActionForm({ transactionId: "", reason: "", notes: "" });
      fetchWithdrawals();
      fetchStats();
    } catch (error: any) {
      console.error("Error rejecting withdrawal:", error);
      alert(error.message || "Failed to reject withdrawal");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Financial Oversight
        </h2>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Pending Withdrawals
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.withdrawals.pending}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatCurrency(stats.withdrawals.pendingAmount)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Approved Withdrawals
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.withdrawals.approved}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatCurrency(stats.withdrawals.approvedAmount)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Active Investments
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.investments.active}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              of {stats.investments.total} total
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Investment Volume
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.investments.totalVolume)}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading withdrawals...
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No withdrawals found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bank Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {withdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {withdrawal.user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {withdrawal.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(withdrawal.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {withdrawal.bankName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {withdrawal.accountNumber} - {withdrawal.accountName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {withdrawal.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setActionModal({
                                type: "approve",
                                withdrawalId: withdrawal.id,
                              });
                            }}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setActionModal({
                                type: "reject",
                                withdrawalId: withdrawal.id,
                              });
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {withdrawal.status !== "PENDING" && (
                        <button
                          onClick={() => setSelectedWithdrawal(withdrawal)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {actionModal.type === "approve" &&
        actionModal.withdrawalId &&
        selectedWithdrawal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Approve Withdrawal
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    User:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedWithdrawal.user.name}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Amount:
                  </span>
                  <span className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(selectedWithdrawal.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedWithdrawal.bankName}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedWithdrawal.accountNumber} -{" "}
                    {selectedWithdrawal.accountName}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction ID (required)
                  </label>
                  <input
                    type="text"
                    value={actionForm.transactionId}
                    onChange={(e) =>
                      setActionForm({
                        ...actionForm,
                        transactionId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter transaction/reference ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={actionForm.notes}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Optional notes..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(actionModal.withdrawalId!)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setActionModal({ type: null, withdrawalId: null });
                      setActionForm({
                        transactionId: "",
                        reason: "",
                        notes: "",
                      });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Reject Modal */}
      {actionModal.type === "reject" &&
        actionModal.withdrawalId &&
        selectedWithdrawal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Reject Withdrawal
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    User:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedWithdrawal.user.name}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Amount:
                  </span>
                  <span className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(selectedWithdrawal.amount)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rejection Reason (required, min 10 characters)
                  </label>
                  <textarea
                    value={actionForm.reason}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, reason: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter detailed reason for rejection..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleReject(actionModal.withdrawalId!)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setActionModal({ type: null, withdrawalId: null });
                      setActionForm({
                        transactionId: "",
                        reason: "",
                        notes: "",
                      });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* View Details Modal */}
      {selectedWithdrawal && !actionModal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Withdrawal Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  User:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedWithdrawal.user.name}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount:
                </span>
                <span className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedWithdrawal.amount)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bank:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedWithdrawal.bankName}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedWithdrawal.accountNumber} -{" "}
                  {selectedWithdrawal.accountName}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedWithdrawal.status
                  )}`}
                >
                  {selectedWithdrawal.status}
                </span>
              </div>
              {selectedWithdrawal.transactionId && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Transaction ID:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedWithdrawal.transactionId}
                  </span>
                </div>
              )}
              {selectedWithdrawal.adminNotes && (
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Admin Notes:
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {selectedWithdrawal.adminNotes}
                  </div>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Request Date:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {new Date(selectedWithdrawal.requestDate).toLocaleString()}
                </span>
              </div>
              {selectedWithdrawal.approvedAt && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Processed Date:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedWithdrawal.approvedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
