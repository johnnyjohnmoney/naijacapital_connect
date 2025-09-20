// Analytics utilities for portfolio performance tracking and ROI calculations

export interface Investment {
  id: string;
  amount: number;
  currentValue: number;
  investmentDate: string;
  status: string;
  business: {
    title: string;
    sector: string;
  };
  returns?: InvestmentReturn[];
}

export interface InvestmentReturn {
  id: string;
  amount: number;
  date: string;
  type: string;
}

export interface PerformanceMetrics {
  totalInvested: number;
  totalCurrentValue: number;
  totalReturns: number;
  netGain: number;
  roi: number;
  averageROI: number;
  bestPerformingInvestment: Investment | null;
  worstPerformingInvestment: Investment | null;
  portfolioGrowth: number;
  monthlyGrowthRate: number;
  yearlyGrowthRate: number;
}

export interface SectorAnalysis {
  sector: string;
  totalInvested: number;
  totalReturns: number;
  roi: number;
  investmentCount: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  portfolioValue: number;
  totalInvested: number;
  totalReturns: number;
  roi: number;
}

/**
 * Calculate ROI for a single investment
 */
export function calculateInvestmentROI(investment: Investment): number {
  if (investment.amount === 0) return 0;
  const totalReturns =
    investment.returns?.reduce((sum, ret) => sum + ret.amount, 0) || 0;
  const currentGain =
    investment.currentValue - investment.amount + totalReturns;
  return (currentGain / investment.amount) * 100;
}

/**
 * Calculate overall portfolio performance metrics
 */
export function calculatePortfolioMetrics(
  investments: Investment[]
): PerformanceMetrics {
  if (!investments.length) {
    return {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalReturns: 0,
      netGain: 0,
      roi: 0,
      averageROI: 0,
      bestPerformingInvestment: null,
      worstPerformingInvestment: null,
      portfolioGrowth: 0,
      monthlyGrowthRate: 0,
      yearlyGrowthRate: 0,
    };
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0
  );
  const totalReturns = investments.reduce((sum, inv) => {
    return (
      sum + (inv.returns?.reduce((retSum, ret) => retSum + ret.amount, 0) || 0)
    );
  }, 0);

  const netGain = totalCurrentValue - totalInvested + totalReturns;
  const roi = totalInvested > 0 ? (netGain / totalInvested) * 100 : 0;

  // Calculate individual ROIs for average
  const rois = investments.map(calculateInvestmentROI);
  const averageROI =
    rois.length > 0 ? rois.reduce((sum, roi) => sum + roi, 0) / rois.length : 0;

  // Find best and worst performing investments
  const investmentRois = investments.map((inv) => ({
    investment: inv,
    roi: calculateInvestmentROI(inv),
  }));

  const bestPerforming = investmentRois.reduce(
    (best, current) => (current.roi > best.roi ? current : best),
    investmentRois[0]
  );

  const worstPerforming = investmentRois.reduce(
    (worst, current) => (current.roi < worst.roi ? current : worst),
    investmentRois[0]
  );

  // Calculate growth rates
  const portfolioGrowth =
    totalInvested > 0
      ? ((totalCurrentValue + totalReturns) / totalInvested - 1) * 100
      : 0;

  // Calculate time-based growth rates (simplified - would need historical data for accuracy)
  const oldestInvestment = investments.reduce(
    (oldest, inv) =>
      new Date(inv.investmentDate) < new Date(oldest.investmentDate)
        ? inv
        : oldest,
    investments[0]
  );

  const monthsSinceOldest = oldestInvestment
    ? Math.max(
        1,
        (Date.now() - new Date(oldestInvestment.investmentDate).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      )
    : 1;

  const monthlyGrowthRate =
    Math.pow(1 + portfolioGrowth / 100, 1 / monthsSinceOldest) - 1;
  const yearlyGrowthRate = Math.pow(1 + monthlyGrowthRate, 12) - 1;

  return {
    totalInvested,
    totalCurrentValue,
    totalReturns,
    netGain,
    roi,
    averageROI,
    bestPerformingInvestment: bestPerforming?.investment || null,
    worstPerformingInvestment: worstPerforming?.investment || null,
    portfolioGrowth,
    monthlyGrowthRate: monthlyGrowthRate * 100,
    yearlyGrowthRate: yearlyGrowthRate * 100,
  };
}

/**
 * Analyze portfolio by sector
 */
export function analyzeBySector(investments: Investment[]): SectorAnalysis[] {
  const sectorMap = new Map<
    string,
    {
      totalInvested: number;
      totalReturns: number;
      investmentCount: number;
      investments: Investment[];
    }
  >();

  investments.forEach((investment) => {
    const sector = investment.business.sector;
    const existing = sectorMap.get(sector) || {
      totalInvested: 0,
      totalReturns: 0,
      investmentCount: 0,
      investments: [],
    };

    const returns =
      investment.returns?.reduce((sum, ret) => sum + ret.amount, 0) || 0;

    sectorMap.set(sector, {
      totalInvested: existing.totalInvested + investment.amount,
      totalReturns:
        existing.totalReturns +
        returns +
        (investment.currentValue - investment.amount),
      investmentCount: existing.investmentCount + 1,
      investments: [...existing.investments, investment],
    });
  });

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return Array.from(sectorMap.entries()).map(([sector, data]) => ({
    sector,
    totalInvested: data.totalInvested,
    totalReturns: data.totalReturns,
    roi:
      data.totalInvested > 0
        ? (data.totalReturns / data.totalInvested) * 100
        : 0,
    investmentCount: data.investmentCount,
    percentage:
      totalInvested > 0 ? (data.totalInvested / totalInvested) * 100 : 0,
  }));
}

/**
 * Generate time series data for portfolio performance
 */
export function generateTimeSeriesData(
  investments: Investment[],
  months: number = 12
): TimeSeriesData[] {
  const now = new Date();
  const timeSeriesData: TimeSeriesData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const dateStr = date.toISOString().slice(0, 7); // YYYY-MM format

    // Calculate portfolio value at this point in time
    const relevantInvestments = investments.filter(
      (inv) => new Date(inv.investmentDate) <= date
    );

    const totalInvested = relevantInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const totalReturns = relevantInvestments.reduce((sum, inv) => {
      const returnsBeforeDate =
        inv.returns?.filter((ret) => new Date(ret.date) <= date) || [];
      return (
        sum + returnsBeforeDate.reduce((retSum, ret) => retSum + ret.amount, 0)
      );
    }, 0);

    // Simulate portfolio value growth (in real implementation, this would come from historical data)
    const baseValue = relevantInvestments.reduce(
      (sum, inv) => sum + inv.currentValue,
      0
    );
    const monthsFromNow = i;
    const portfolioValue = baseValue * (1 - monthsFromNow * 0.02); // Simplified growth simulation

    const roi =
      totalInvested > 0
        ? ((portfolioValue + totalReturns - totalInvested) / totalInvested) *
          100
        : 0;

    timeSeriesData.push({
      date: dateStr,
      portfolioValue: Math.max(0, portfolioValue),
      totalInvested,
      totalReturns,
      roi,
    });
  }

  return timeSeriesData;
}

/**
 * Calculate business performance metrics for business owners
 */
export interface BusinessMetrics {
  totalCapitalRaised: number;
  averageInvestmentSize: number;
  investorCount: number;
  capitalUtilizationRate: number;
  investorRetentionRate: number;
  roiDelivered: number;
  growthRate: number;
  fundingMilestones: FundingMilestone[];
}

export interface FundingMilestone {
  date: string;
  amount: number;
  cumulativeAmount: number;
  investorCount: number;
  milestone: string;
}

export function calculateBusinessMetrics(
  opportunities: any[],
  investments: any[]
): BusinessMetrics {
  const totalCapitalRaised = investments.reduce(
    (sum: number, inv: any) => sum + inv.amount,
    0
  );
  const averageInvestmentSize =
    investments.length > 0 ? totalCapitalRaised / investments.length : 0;
  const investorCount = new Set(investments.map((inv: any) => inv.investor?.id))
    .size;

  const totalTargetCapital = opportunities.reduce(
    (sum: any, opp: any) => sum + opp.targetCapital,
    0
  );
  const capitalUtilizationRate =
    totalTargetCapital > 0
      ? (totalCapitalRaised / totalTargetCapital) * 100
      : 0;

  // Simplified metrics (would need more historical data in real implementation)
  const investorRetentionRate = 85; // Would calculate from repeat investments
  const roiDelivered = 15.5; // Would calculate from actual returns delivered
  const growthRate = 12.3; // Would calculate from business performance data

  // Generate funding milestones
  const sortedInvestments = [...investments].sort(
    (a: any, b: any) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const fundingMilestones: FundingMilestone[] = [];
  let cumulativeAmount = 0;
  let cumulativeInvestors = new Set();

  sortedInvestments.forEach((inv: any, index: number) => {
    cumulativeAmount += inv.amount;
    cumulativeInvestors.add(inv.investor?.id);

    // Create milestone every 5 investments or at significant amounts
    if (
      index % 5 === 0 ||
      cumulativeAmount >= 1000000 * (fundingMilestones.length + 1)
    ) {
      fundingMilestones.push({
        date: inv.createdAt,
        amount: inv.amount,
        cumulativeAmount,
        investorCount: cumulativeInvestors.size,
        milestone: `Milestone ${fundingMilestones.length + 1}`,
      });
    }
  });

  return {
    totalCapitalRaised,
    averageInvestmentSize,
    investorCount,
    capitalUtilizationRate,
    investorRetentionRate,
    roiDelivered,
    growthRate,
    fundingMilestones,
  };
}

/**
 * Calculate platform-wide analytics for administrators
 */
export interface PlatformMetrics {
  totalUsers: number;
  totalBusinesses: number;
  totalInvestments: number;
  totalVolume: number;
  averageInvestmentSize: number;
  platformGrowthRate: number;
  userAcquisitionRate: number;
  investmentSuccessRate: number;
  platformROI: number;
  topPerformingSectors: SectorAnalysis[];
  monthlyTrends: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  newUsers: number;
  newInvestments: number;
  investmentVolume: number;
  newBusinesses: number;
}

export function calculatePlatformMetrics(
  users: any[],
  businesses: any[],
  investments: any[]
): PlatformMetrics {
  const totalUsers = users.length;
  const totalBusinesses = businesses.length;
  const totalInvestments = investments.length;
  const totalVolume = investments.reduce(
    (sum: number, inv: any) => sum + inv.amount,
    0
  );
  const averageInvestmentSize =
    totalInvestments > 0 ? totalVolume / totalInvestments : 0;

  // Calculate growth rates (simplified)
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthInvestments = investments.filter(
    (inv: any) => new Date(inv.createdAt) >= lastMonth
  );

  const platformGrowthRate =
    totalInvestments > 0
      ? (lastMonthInvestments.length / totalInvestments) * 100
      : 0;

  const userAcquisitionRate = 15.2; // Would calculate from actual user signup data
  const investmentSuccessRate =
    (investments.filter((inv: any) => inv.status === "ACTIVE").length /
      totalInvestments) *
    100;
  const platformROI = 18.5; // Would calculate from overall platform performance

  // Generate mock monthly trends (would use real data in production)
  const monthlyTrends: MonthlyTrend[] = [];
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyTrends.push({
      month: month.toISOString().slice(0, 7),
      newUsers: Math.floor(Math.random() * 50) + 20,
      newInvestments: Math.floor(Math.random() * 15) + 5,
      investmentVolume: Math.floor(Math.random() * 5000000) + 1000000,
      newBusinesses: Math.floor(Math.random() * 8) + 2,
    });
  }

  return {
    totalUsers,
    totalBusinesses,
    totalInvestments,
    totalVolume,
    averageInvestmentSize,
    platformGrowthRate,
    userAcquisitionRate,
    investmentSuccessRate,
    platformROI,
    topPerformingSectors: [], // Would populate with real sector data
    monthlyTrends,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
