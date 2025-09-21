"use client";

import React, { useState } from "react";
import {
  Download,
  FileText,
  Table,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";

interface ExportOptions {
  format: "pdf" | "csv";
  dateRange: "all" | "ytd" | "last12months" | "custom";
  startDate?: string;
  endDate?: string;
  includeAnalytics: boolean;
  includeSectorBreakdown: boolean;
  includePerformanceMetrics: boolean;
  includeReturnHistory: boolean;
}

interface ExportComponentProps {
  portfolioData?: any[];
  performanceMetrics?: any;
  sectorAnalysis?: any[];
  returnHistory?: any[];
}

export default function PortfolioExport({
  portfolioData = [],
  performanceMetrics = null,
  sectorAnalysis = [],
  returnHistory = [],
}: ExportComponentProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    dateRange: "all",
    includeAnalytics: true,
    includeSectorBreakdown: true,
    includePerformanceMetrics: true,
    includeReturnHistory: true,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Mock data for demonstration if no data is provided
  const mockPortfolioData =
    portfolioData.length > 0
      ? portfolioData
      : [
          {
            id: 1,
            businessName: "Lagos Tech Hub",
            sector: "Technology",
            investmentAmount: 500000,
            currentValue: 625000,
            returnRate: 25.0,
            status: "Active",
            investmentDate: "2023-06-15",
          },
          {
            id: 2,
            businessName: "Green Energy Solutions",
            sector: "Renewable Energy",
            investmentAmount: 750000,
            currentValue: 892500,
            returnRate: 19.0,
            status: "Active",
            investmentDate: "2023-08-22",
          },
        ];

  const mockPerformanceMetrics = performanceMetrics || {
    totalInvested: 2500000,
    totalCurrentValue: 2887500,
    totalReturns: 387500,
    roi: 15.5,
    annualizedReturn: 12.8,
    diversificationScore: 85,
  };

  const mockSectorAnalysis =
    sectorAnalysis.length > 0
      ? sectorAnalysis
      : [
          { sector: "Technology", percentage: 35, totalValue: 1010000 },
          { sector: "Renewable Energy", percentage: 30, totalValue: 866000 },
          { sector: "Agriculture", percentage: 20, totalValue: 577000 },
          { sector: "Healthcare", percentage: 15, totalValue: 433500 },
        ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate CSV content
  const generateCSV = (): string => {
    const csvRows: string[] = [];

    // Header
    csvRows.push("NAIJACONNECT CAPITAL - PORTFOLIO EXPORT");
    csvRows.push(`Generated on: ${new Date().toLocaleString()}`);
    csvRows.push(""); // Empty row

    // Portfolio Summary
    if (exportOptions.includePerformanceMetrics) {
      csvRows.push("PORTFOLIO SUMMARY");
      csvRows.push("Metric,Value");
      csvRows.push(`Total Invested,${mockPerformanceMetrics.totalInvested}`);
      csvRows.push(`Current Value,${mockPerformanceMetrics.totalCurrentValue}`);
      csvRows.push(`Total Returns,${mockPerformanceMetrics.totalReturns}`);
      csvRows.push(`ROI,${mockPerformanceMetrics.roi}%`);
      csvRows.push(
        `Annualized Return,${mockPerformanceMetrics.annualizedReturn}%`
      );
      csvRows.push(""); // Empty row
    }

    // Portfolio Holdings
    csvRows.push("PORTFOLIO HOLDINGS");
    csvRows.push(
      "Business Name,Sector,Investment Amount,Current Value,Return Rate,Status,Investment Date"
    );

    mockPortfolioData.forEach((investment) => {
      csvRows.push(
        `"${investment.businessName}","${investment.sector}",${investment.investmentAmount},${investment.currentValue},${investment.returnRate}%,"${investment.status}","${investment.investmentDate}"`
      );
    });
    csvRows.push(""); // Empty row

    // Sector Analysis
    if (exportOptions.includeSectorBreakdown) {
      csvRows.push("SECTOR BREAKDOWN");
      csvRows.push("Sector,Percentage,Total Value");

      mockSectorAnalysis.forEach((sector) => {
        csvRows.push(
          `"${sector.sector}",${sector.percentage}%,${sector.totalValue}`
        );
      });
      csvRows.push(""); // Empty row
    }

    // Return History
    if (exportOptions.includeReturnHistory && returnHistory.length > 0) {
      csvRows.push("RETURN HISTORY");
      csvRows.push("Date,Business,Amount,Type");

      returnHistory.forEach((returnItem) => {
        csvRows.push(
          `"${returnItem.date}","${returnItem.businessName}",${returnItem.amount},"${returnItem.type}"`
        );
      });
    }

    return csvRows.join("\n");
  };

  // Generate PDF content (HTML that will be converted to PDF)
  const generatePDFHTML = (): string => {
    const currentDate = new Date().toLocaleString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Portfolio Export</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 2px solid #059669; 
            padding-bottom: 20px;
          }
          .company-logo { 
            font-size: 24px; 
            font-weight: bold; 
            color: #059669; 
          }
          .export-info { 
            font-size: 12px; 
            color: #666; 
            margin-top: 10px;
          }
          .section { 
            margin-bottom: 30px; 
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #059669; 
            margin-bottom: 15px; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 5px;
          }
          .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px; 
            margin-bottom: 20px;
          }
          .metric-card { 
            background: #f9fafb; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #059669;
          }
          .metric-label { 
            font-size: 12px; 
            color: #666; 
            margin-bottom: 5px;
          }
          .metric-value { 
            font-size: 18px; 
            font-weight: bold; 
            color: #333;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px 8px; 
            text-align: left;
          }
          th { 
            background-color: #059669; 
            color: white; 
            font-weight: bold;
          }
          tr:nth-child(even) { 
            background-color: #f9fafb;
          }
          .currency { 
            text-align: right; 
            font-family: monospace;
          }
          .percentage { 
            text-align: center; 
            font-weight: bold;
          }
          .positive { 
            color: #059669;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #ddd; 
            padding-top: 20px;
          }
          .page-break { 
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-logo">NAIJACONNECT CAPITAL</div>
          <h2>Portfolio Performance Report</h2>
          <div class="export-info">Generated on: ${currentDate}</div>
        </div>

        ${
          exportOptions.includePerformanceMetrics
            ? `
        <div class="section">
          <div class="section-title">Portfolio Summary</div>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Total Invested</div>
              <div class="metric-value">${formatCurrency(
                mockPerformanceMetrics.totalInvested
              )}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Current Value</div>
              <div class="metric-value">${formatCurrency(
                mockPerformanceMetrics.totalCurrentValue
              )}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Returns</div>
              <div class="metric-value positive">${formatCurrency(
                mockPerformanceMetrics.totalReturns
              )}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">ROI</div>
              <div class="metric-value positive">${
                mockPerformanceMetrics.roi
              }%</div>
            </div>
          </div>
        </div>
        `
            : ""
        }

        <div class="section">
          <div class="section-title">Portfolio Holdings</div>
          <table>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Sector</th>
                <th>Investment Amount</th>
                <th>Current Value</th>
                <th>Return Rate</th>
                <th>Status</th>
                <th>Investment Date</th>
              </tr>
            </thead>
            <tbody>
              ${mockPortfolioData
                .map(
                  (investment) => `
                <tr>
                  <td>${investment.businessName}</td>
                  <td>${investment.sector}</td>
                  <td class="currency">${formatCurrency(
                    investment.investmentAmount
                  )}</td>
                  <td class="currency">${formatCurrency(
                    investment.currentValue
                  )}</td>
                  <td class="percentage positive">${investment.returnRate}%</td>
                  <td>${investment.status}</td>
                  <td>${formatDate(investment.investmentDate)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        ${
          exportOptions.includeSectorBreakdown
            ? `
        <div class="section">
          <div class="section-title">Sector Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Sector</th>
                <th>Percentage</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              ${mockSectorAnalysis
                .map(
                  (sector) => `
                <tr>
                  <td>${sector.sector}</td>
                  <td class="percentage">${sector.percentage}%</td>
                  <td class="currency">${formatCurrency(sector.totalValue)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p>This report is generated by NaijaConnect Capital investment platform.</p>
          <p>For questions about your portfolio, please contact your investment advisor.</p>
        </div>
      </body>
      </html>
    `;
  };

  const downloadFile = (
    content: string,
    filename: string,
    contentType: string
  ) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().slice(0, 10);

      if (exportOptions.format === "csv") {
        const csvContent = generateCSV();
        downloadFile(
          csvContent,
          `portfolio-export-${timestamp}.csv`,
          "text/csv"
        );
      } else {
        const htmlContent = generatePDFHTML();

        // In a real implementation, you would send this to a server endpoint
        // that converts HTML to PDF using libraries like Puppeteer or jsPDF
        // For now, we'll download the HTML content
        downloadFile(
          htmlContent,
          `portfolio-export-${timestamp}.html`,
          "text/html"
        );

        // Show message about PDF conversion
        alert(
          "HTML file downloaded. In production, this would be converted to PDF on the server."
        );
      }

      setShowOptions(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Download className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Export Portfolio</h2>
        </div>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Portfolio</span>
        </button>
      </div>

      {showOptions && (
        <div className="border-t pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="pdf"
                    checked={exportOptions.format === "pdf"}
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        format: e.target.value as "pdf" | "csv",
                      })
                    }
                    className="mr-2"
                  />
                  <FileText className="h-4 w-4 mr-2 text-red-600" />
                  <span>PDF Report</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportOptions.format === "csv"}
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        format: e.target.value as "pdf" | "csv",
                      })
                    }
                    className="mr-2"
                  />
                  <Table className="h-4 w-4 mr-2 text-green-600" />
                  <span>CSV Data</span>
                </label>
              </div>
            </div>

            {/* Date Range Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date Range
              </label>
              <select
                value={exportOptions.dateRange}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    dateRange: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="ytd">Year to Date</option>
                <option value="last12months">Last 12 Months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {exportOptions.dateRange === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={exportOptions.startDate || ""}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={exportOptions.endDate || ""}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include in Export
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includePerformanceMetrics}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includePerformanceMetrics: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                <span>Performance Metrics</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeSectorBreakdown}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeSectorBreakdown: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <div className="h-4 w-4 mr-2 bg-purple-600 rounded"></div>
                <span>Sector Breakdown</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeReturnHistory}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeReturnHistory: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <Calendar className="h-4 w-4 mr-2 text-green-600" />
                <span>Return History</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeAnalytics}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeAnalytics: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <DollarSign className="h-4 w-4 mr-2 text-yellow-600" />
                <span>Analytics Summary</span>
              </label>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={() => setShowOptions(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Generate Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Export Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Export Preview
        </h3>
        <div className="text-sm text-gray-600">
          <p>• Portfolio Holdings: {mockPortfolioData.length} investments</p>
          <p>
            • Total Portfolio Value:{" "}
            {formatCurrency(mockPerformanceMetrics.totalCurrentValue)}
          </p>
          <p>• Sector Distribution: {mockSectorAnalysis.length} sectors</p>
          {exportOptions.includePerformanceMetrics && (
            <p>• Performance metrics included</p>
          )}
          {exportOptions.includeSectorBreakdown && (
            <p>• Sector analysis included</p>
          )}
          {exportOptions.includeReturnHistory && (
            <p>• Return history included</p>
          )}
        </div>
      </div>
    </div>
  );
}
