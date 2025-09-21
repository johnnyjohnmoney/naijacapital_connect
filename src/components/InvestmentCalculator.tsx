"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Calendar,
  Percent,
} from "lucide-react";

interface CalculatorResult {
  futureValue: number;
  totalReturns: number;
  roi: number;
  annualizedReturn: number;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  inflationAdjustedValue: number;
}

interface ScenarioAnalysis {
  conservative: CalculatorResult;
  moderate: CalculatorResult;
  aggressive: CalculatorResult;
}

export default function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timeHorizon, setTimeHorizon] = useState<number>(5);
  const [inflationRate, setInflationRate] = useState<number>(3.5);
  const [riskTolerance, setRiskTolerance] = useState<"Low" | "Medium" | "High">(
    "Medium"
  );

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioAnalysis | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Calculate investment results
  const calculateInvestment = (
    principal: number,
    monthly: number,
    rate: number,
    years: number,
    inflation: number,
    riskLevel: "Low" | "Medium" | "High"
  ): CalculatorResult => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    // Future value of initial investment
    const futureValuePrincipal =
      principal * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of monthly contributions (annuity)
    const futureValueAnnuity =
      (monthly * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / monthlyRate;

    const futureValue = futureValuePrincipal + futureValueAnnuity;
    const totalInvested = principal + monthly * totalMonths;
    const totalReturns = futureValue - totalInvested;
    const roi = (totalReturns / totalInvested) * 100;
    const annualizedReturn =
      (Math.pow(futureValue / totalInvested, 1 / years) - 1) * 100;

    // Risk assessment
    const riskMultipliers = { Low: 0.8, Medium: 1.0, High: 1.3 };
    const baseRisk = (rate - 5) * 2; // Base risk calculation
    const riskScore = Math.min(
      100,
      Math.max(0, baseRisk * riskMultipliers[riskLevel])
    );

    // Inflation adjustment
    const inflationAdjustedValue =
      futureValue / Math.pow(1 + inflation / 100, years);

    return {
      futureValue,
      totalReturns,
      roi,
      annualizedReturn,
      riskScore,
      riskLevel,
      inflationAdjustedValue,
    };
  };

  // Generate scenario analysis
  const generateScenarios = (): ScenarioAnalysis => {
    const conservativeRate = Math.max(6, expectedReturn - 4);
    const moderateRate = expectedReturn;
    const aggressiveRate = expectedReturn + 4;

    return {
      conservative: calculateInvestment(
        initialAmount,
        monthlyContribution,
        conservativeRate,
        timeHorizon,
        inflationRate,
        "Low"
      ),
      moderate: calculateInvestment(
        initialAmount,
        monthlyContribution,
        moderateRate,
        timeHorizon,
        inflationRate,
        "Medium"
      ),
      aggressive: calculateInvestment(
        initialAmount,
        monthlyContribution,
        aggressiveRate,
        timeHorizon,
        inflationRate,
        "High"
      ),
    };
  };

  // Update calculations when inputs change
  useEffect(() => {
    const newResult = calculateInvestment(
      initialAmount,
      monthlyContribution,
      expectedReturn,
      timeHorizon,
      inflationRate,
      riskTolerance
    );

    setResult(newResult);
    setScenarios(generateScenarios());
  }, [
    initialAmount,
    monthlyContribution,
    expectedReturn,
    timeHorizon,
    inflationRate,
    riskTolerance,
  ]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Investment Calculator
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Investment Parameters
            </h2>

            {/* Basic Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Initial Investment Amount
                </label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Monthly Contribution
                </label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) =>
                    setMonthlyContribution(Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Percent className="inline h-4 w-4 mr-1" />
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Investment Time Horizon (Years)
                </label>
                <input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  Risk Tolerance
                </label>
                <select
                  value={riskTolerance}
                  onChange={(e) =>
                    setRiskTolerance(
                      e.target.value as "Low" | "Medium" | "High"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
            </div>

            {/* Advanced Options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Options
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Inflation Rate (%)
                    </label>
                    <input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      placeholder="3.5"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Investment Projection
                </h2>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Future Value</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(result.futureValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Returns</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(result.totalReturns)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ROI</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatPercentage(result.roi)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Annualized Return</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatPercentage(result.annualizedReturn)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Risk Assessment</p>
                        <p
                          className={`font-semibold ${getRiskColor(
                            result.riskLevel
                          )}`}
                        >
                          {result.riskLevel} Risk ({result.riskScore.toFixed(0)}
                          /100)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Inflation Adjusted
                        </p>
                        <p className="font-semibold text-gray-800">
                          {formatCurrency(result.inflationAdjustedValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scenario Analysis */}
        {scenarios && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Scenario Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(scenarios).map(([scenario, data]) => (
                <div key={scenario} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 capitalize mb-3">
                    {scenario} Scenario
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Future Value:</span>
                      <span className="font-medium">
                        {formatCurrency(data.futureValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Returns:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(data.totalReturns)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-medium">
                        {formatPercentage(data.roi)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span
                        className={`font-medium ${getRiskColor(
                          data.riskLevel
                        )}`}
                      >
                        {data.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investment Breakdown */}
        {result && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Investment Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Initial Investment</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(initialAmount)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Contributions</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(monthlyContribution * timeHorizon * 12)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Invested</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(
                    initialAmount + monthlyContribution * timeHorizon * 12
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
