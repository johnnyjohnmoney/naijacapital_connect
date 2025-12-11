"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  industry: string;
  targetCapital: number;
  minimumInvestment: number;
  status: string;
  submittedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

interface OpportunityReviewPanelProps {
  adminId: string;
}

export default function OpportunityReviewPanel({
  adminId,
}: OpportunityReviewPanelProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING_REVIEW");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, [statusFilter, searchQuery]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/admin/opportunities?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch opportunities");
      }

      const data = await response.json();
      setOpportunities(data.opportunities || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (opportunityId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/opportunities/${opportunityId}/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminNotes: "Approved after review",
          }),
        }
      );

      if (response.ok) {
        alert("Opportunity approved successfully!");
        fetchOpportunities();
        setSelectedOpportunity(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve opportunity");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (opportunityId: string, reason: string) => {
    if (!reason || reason.length < 10) {
      alert(
        "Please provide a detailed rejection reason (at least 10 characters)"
      );
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/opportunities/${opportunityId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rejectionReason: reason,
          }),
        }
      );

      if (response.ok) {
        alert("Opportunity rejected");
        fetchOpportunities();
        setSelectedOpportunity(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Failed to reject opportunity");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async (
    opportunityId: string,
    feedback: string
  ) => {
    if (!feedback || feedback.length < 20) {
      alert("Please provide detailed feedback (at least 20 characters)");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/opportunities/${opportunityId}/request-changes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revisionRequests: feedback,
          }),
        }
      );

      if (response.ok) {
        alert("Revision requests sent to business owner");
        fetchOpportunities();
        setSelectedOpportunity(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Request changes error:", error);
      alert("Failed to request changes");
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Server-side filtering is now handled by the API, so we use opportunities directly
  const filteredOpportunities = opportunities;

  const statusTabs = [
    { id: "PENDING_REVIEW", name: "Pending Review", color: "yellow" },
    { id: "NEEDS_REVISION", name: "Needs Revision", color: "blue" },
    { id: "OPEN", name: "Approved", color: "green" },
    { id: "REJECTED", name: "Rejected", color: "red" },
    { id: "SUSPENDED", name: "Suspended", color: "gray" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Opportunity Reviews
        </h2>
        <button
          onClick={fetchOpportunities}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`${
                statusFilter === tab.id
                  ? `border-${tab.color}-500 text-${tab.color}-600`
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No opportunities found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Capital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOpportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {opportunity.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {opportunity.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {opportunity.owner.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {opportunity.owner.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opportunity.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(opportunity.targetCapital)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(opportunity.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {statusFilter === "PENDING_REVIEW" ||
                    statusFilter === "NEEDS_REVISION" ? (
                      <>
                        <button
                          onClick={() => handleApprove(opportunity.id)}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircleIcon className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt(
                              "Enter rejection reason (min 10 characters):"
                            );
                            if (reason) handleReject(opportunity.id, reason);
                          }}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircleIcon className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => {
                            const feedback = prompt(
                              "Enter revision feedback (min 20 characters):"
                            );
                            if (feedback)
                              handleRequestChanges(opportunity.id, feedback);
                          }}
                          disabled={actionLoading}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          title="Request Changes"
                        >
                          <ClockIcon className="h-5 w-5 inline" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setSelectedOpportunity(opportunity)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
