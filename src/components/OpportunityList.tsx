"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InvestmentModal from "@/components/InvestmentModal";
import {
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Interface for opportunity data
interface Opportunity {
  id: string;
  title: string;
  description: string;
  targetCapital: number;
  minimumInvestment: number;
  currentRaised: number;
  expectedROI: number;
  timeline: number;
  industry: string;
  riskLevel: string;
  status: string;
  ownerId: string;
  owner: {
    name: string;
    id: string;
  };
  _count: {
    investments: number;
  };
}

interface OpportunityListProps {
  showSearch?: boolean;
  limit?: number;
  showPagination?: boolean;
  title?: string;
  description?: string;
  compact?: boolean;
}

export default function OpportunityList({
  showSearch = true,
  limit = 12,
  showPagination = true,
  title = "Investment Opportunities",
  description = "Discover pre-vetted Nigerian business opportunities",
  compact = false,
}: OpportunityListProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    industry: "all",
    riskLevel: "all",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: limit,
    totalPages: 0,
  });

  // Helper functions
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

  // Fetch opportunities from API
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add filters to query params
      if (filters.industry !== "all")
        queryParams.append("industry", filters.industry);
      if (filters.riskLevel !== "all")
        queryParams.append("riskLevel", filters.riskLevel);

      const response = await fetch(`/api/opportunities?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch opportunities");
      }

      const data = await response.json();
      let filteredOpportunities = data.businesses;

      // Apply search filter
      if (searchTerm) {
        filteredOpportunities = filteredOpportunities.filter(
          (opp: Opportunity) =>
            opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.industry.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setOpportunities(filteredOpportunities);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [pagination.page, filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpportunities();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleQuickInvest = (opportunity: Opportunity) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Only investors can invest
    if (session.user.role !== "INVESTOR") {
      alert(
        "Only investors can make investments. Business owners should focus on managing their opportunities."
      );
      return;
    }

    setSelectedOpportunity(opportunity);
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

      // Refresh the opportunities to show updated data
      await fetchOpportunities();
    } catch (error) {
      console.error("Investment submission failed:", error);
      throw error;
    }
  };

  if (loading && opportunities.length === 0) {
    return (
      <div className={compact ? "space-y-4" : "space-y-6"}>
        {!compact && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-2">{description}</p>
          </div>
        )}
        <div
          className={`grid grid-cols-1 ${
            compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          } gap-6`}
        >
          {[...Array(limit > 6 ? 6 : limit)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
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
            <button
              onClick={fetchOpportunities}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {!compact && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
      )}

      {/* Search and Filters */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={filters.industry}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, industry: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Energy">Energy</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Finance">Finance</option>
          </select>
          <select
            value={filters.riskLevel}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, riskLevel: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>
      )}

      {/* Opportunities Grid */}
      {opportunities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No opportunities found matching your criteria.
          </p>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 ${
            compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          } gap-6`}
        >
          {opportunities.slice(0, limit).map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className={compact ? "p-4" : "p-6"}>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      className={`${
                        compact ? "text-base" : "text-lg"
                      } font-semibold text-gray-900 line-clamp-2`}
                    >
                      {opportunity.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      by {opportunity.owner.name}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      opportunity.riskLevel === "Low"
                        ? "bg-green-100 text-green-800"
                        : opportunity.riskLevel === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {opportunity.riskLevel} Risk
                  </span>
                </div>

                {/* Description */}
                {!compact && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>
                )}

                {/* Key Metrics */}
                <div className={`space-y-3 ${compact ? "mb-3" : "mb-4"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Target Capital
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(opportunity.targetCapital)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Min Investment
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(opportunity.minimumInvestment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Expected ROI</span>
                    <span className="text-sm font-medium text-green-600">
                      {opportunity.expectedROI}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        {calculateProgress(
                          opportunity.currentRaised,
                          opportunity.targetCapital
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculateProgress(
                            opportunity.currentRaised,
                            opportunity.targetCapital
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {formatCurrency(opportunity.currentRaised)} raised
                      </span>
                      <span className="text-xs text-gray-500">
                        {opportunity._count.investments} investors
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {opportunity.timeline} months
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowTrendingUpIcon className="h-3 w-3" />
                      {opportunity.industry}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Only show Quick Invest button for logged-in investors */}
                    {session && session.user.role === "INVESTOR" && (
                      <button
                        onClick={() => handleQuickInvest(opportunity)}
                        className="text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-500 transition-colors"
                      >
                        {compact ? "Invest" : "Quick Invest"}
                      </button>
                    )}
                    {/* Show login prompt for non-logged users */}
                    {!session && (
                      <Link
                        href="/auth/signin"
                        className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 transition-colors"
                      >
                        Login to Invest
                      </Link>
                    )}
                    {/* Show role-specific message for business owners */}
                    {session && session.user.role === "BUSINESS_OWNER" && (
                      <span className="text-xs text-gray-500 italic">
                        Business Owner
                      </span>
                    )}
                    <Link
                      href={`/opportunities/${opportunity.id}`}
                      className="text-xs font-medium text-green-600 hover:text-green-500"
                    >
                      {compact ? "Details" : "View Details"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={pagination.page === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(prev.totalPages, prev.page + 1),
              }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Investment Modal */}
      {selectedOpportunity && (
        <InvestmentModal
          isOpen={showInvestModal}
          onClose={() => {
            setShowInvestModal(false);
            setSelectedOpportunity(null);
          }}
          opportunity={{
            id: selectedOpportunity.id,
            title: selectedOpportunity.title,
            minimumInvestment: selectedOpportunity.minimumInvestment,
            expectedROI: selectedOpportunity.expectedROI,
            timeline: selectedOpportunity.timeline,
            riskLevel: selectedOpportunity.riskLevel,
            ownerId: selectedOpportunity.ownerId,
          }}
          onInvestmentSubmit={handleInvestmentSubmit}
        />
      )}
    </div>
  );
}
