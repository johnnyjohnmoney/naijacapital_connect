"use client";

import { useState, useEffect } from "react";

interface Report {
  id: string;
  reportType: string;
  targetType: string;
  targetId: string;
  reportReason: string;
  description: string;
  priority: string;
  status: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
  resolution?: string | null;
  createdAt: Date;
  reviewedAt?: Date | null;
  reportedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
  reviewer?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface ReportStats {
  total: number;
  byStatus: {
    pending: number;
    underReview: number;
    resolved: number;
    dismissed: number;
  };
  byPriority: Record<string, number>;
  byTargetType: Record<string, number>;
}

export default function CompliancePanel() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewForm, setReviewForm] = useState({
    status: "UNDER_REVIEW" as "UNDER_REVIEW" | "RESOLVED" | "DISMISSED",
    resolution: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [currentPage, statusFilter, priorityFilter, targetTypeFilter]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/reports/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: statusFilter,
        priority: priorityFilter,
        targetType: targetTypeFilter,
      });

      const response = await fetch(`/api/reports?${params}`);
      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReports(data.reports);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewReport = async (reportId: string) => {
    if (reviewForm.status === "RESOLVED" && !reviewForm.resolution) {
      alert("Please specify the resolution for resolved reports");
      return;
    }

    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update report");
      }

      alert("Report updated successfully");
      setSelectedReport(null);
      setReviewForm({ status: "UNDER_REVIEW", resolution: "" });
      fetchReports();
      fetchStats();
    } catch (error: any) {
      console.error("Error updating report:", error);
      alert(error.message || "Failed to update report");
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete report");

      alert("Report deleted successfully");
      fetchReports();
      fetchStats();
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "RESOLVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "DISMISSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "HIGH":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Compliance & Reports
        </h2>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Pending
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.byStatus.pending}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Under Review
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.byStatus.underReview}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Resolved
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.byStatus.resolved}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Reports
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Type
            </label>
            <select
              value={targetTypeFilter}
              onChange={(e) => {
                setTargetTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="USER">User</option>
              <option value="BUSINESS">Business</option>
              <option value="OPPORTUNITY">Opportunity</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No reports found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Report Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reporter
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
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              report.priority
                            )}`}
                          >
                            {report.priority}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {report.targetType}
                          </span>
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {report.reportReason.substring(0, 80)}...
                        </div>
                        {report.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {report.description.substring(0, 100)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.reportedBy?.name || "System"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {report.reportedBy?.email || "Automated"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setReviewForm({
                            status:
                              report.status === "PENDING"
                                ? "UNDER_REVIEW"
                                : (report.status as any),
                            resolution: report.resolution || "",
                          });
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
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

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Review Report
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Priority:
                </span>
                <span
                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                    selectedReport.priority
                  )}`}
                >
                  {selectedReport.priority}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Target:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedReport.targetType} (ID: {selectedReport.targetId})
                </span>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason:
                </div>
                <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {selectedReport.reportReason}
                </div>
              </div>

              {selectedReport.description && (
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description:
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {selectedReport.description}
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reported by:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedReport.reportedBy?.name || "System"} (
                  {selectedReport.reportedBy?.email || "Automated"})
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Status
                </label>
                <select
                  value={reviewForm.status}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
              </div>

              {reviewForm.status === "RESOLVED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resolution (required for resolved reports)
                  </label>
                  <textarea
                    value={reviewForm.resolution}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        resolution: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe how this was resolved..."
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => handleReviewReport(selectedReport.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Update Report
                </button>
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setReviewForm({ status: "UNDER_REVIEW", resolution: "" });
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
    </div>
  );
}
