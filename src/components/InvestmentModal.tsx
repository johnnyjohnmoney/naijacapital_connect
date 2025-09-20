"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

// Investment form validation schema
const investmentSchema = z.object({
  amount: z
    .number()
    .min(1, "Investment amount must be greater than 0")
    .max(100000000, "Investment amount cannot exceed ₦100,000,000"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: string;
    title: string;
    minimumInvestment: number;
    expectedROI: number;
    timeline: number;
    riskLevel: string;
    ownerId?: string; // Add owner ID to check ownership
  };
  onInvestmentSubmit?: (investmentData: {
    amount: number;
    opportunityId: string;
  }) => Promise<void>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function InvestmentModal({
  isOpen,
  onClose,
  opportunity,
  onInvestmentSubmit,
}: InvestmentModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick amount presets
  const quickAmounts = [
    opportunity.minimumInvestment,
    opportunity.minimumInvestment * 2,
    opportunity.minimumInvestment * 5,
    opportunity.minimumInvestment * 10,
  ];

  const validateForm = () => {
    const numericAmount = parseFloat(amount);

    try {
      investmentSchema.parse({
        amount: numericAmount,
        terms: acceptTerms,
      });

      // Additional validation for minimum investment
      if (numericAmount < opportunity.minimumInvestment) {
        setErrors({
          amount: `Minimum investment is ${formatCurrency(
            opportunity.minimumInvestment
          )}`,
        });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Check if user is trying to invest in their own opportunity
    if (opportunity.ownerId && session.user.id === opportunity.ownerId) {
      setErrors({
        submit:
          "Business owners cannot invest in their own opportunities. This would create a conflict of interest.",
      });
      return;
    }

    // Only investors can make investments
    if (session.user.role !== "INVESTOR") {
      setErrors({
        submit:
          "Only investors can make investments. Business owners should focus on managing their opportunities.",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const investmentData = {
        amount: parseFloat(amount),
        businessId: opportunity.id,
      };

      if (onInvestmentSubmit) {
        await onInvestmentSubmit({
          amount: investmentData.amount,
          opportunityId: opportunity.id,
        });
      } else {
        // Call the actual API endpoint
        const response = await fetch("/api/investments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(investmentData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit investment");
        }

        const result = await response.json();
        alert(
          `Investment of ${formatCurrency(
            parseFloat(amount)
          )} submitted successfully! Status: ${result.investment.status}`
        );
      }

      // Reset form and close modal
      setAmount("");
      setAcceptTerms(false);
      onClose();
    } catch (error) {
      console.error("Investment submission error:", error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Failed to submit investment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProjectedReturns = () => {
    const numericAmount = parseFloat(amount) || 0;
    const monthlyReturn = (numericAmount * opportunity.expectedROI) / 100 / 12;
    const totalReturn = monthlyReturn * opportunity.timeline;
    return {
      monthly: monthlyReturn,
      total: totalReturn,
      totalWithPrincipal: numericAmount + totalReturn,
    };
  };

  if (!isOpen) return null;

  const projectedReturns = calculateProjectedReturns();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Invest in {opportunity.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Investment Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg ${
                  errors.amount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0"
                min={opportunity.minimumInvestment}
                step="1000"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">₦</span>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Minimum investment:{" "}
              {formatCurrency(opportunity.minimumInvestment)}
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  {formatCurrency(quickAmount)}
                </button>
              ))}
            </div>
          </div>

          {/* Investment Summary */}
          {amount && parseFloat(amount) >= opportunity.minimumInvestment && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Investment Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Expected Monthly Return:
                  </span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(projectedReturns.monthly)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expected Return:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(projectedReturns.total)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-900 font-medium">
                    Total After {opportunity.timeline} months:
                  </span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(projectedReturns.totalWithPrincipal)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Risk Warning */}
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">
                  Investment Risk Notice
                </p>
                <p className="text-yellow-700">
                  This is a{" "}
                  <strong>{opportunity.riskLevel.toLowerCase()} risk</strong>{" "}
                  investment. All investments carry risk and you may lose some
                  or all of your capital. Expected returns are projections and
                  not guaranteed.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className={`mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 ${
                  errors.terms ? "border-red-300" : ""
                }`}
              />
              <span className="ml-3 text-sm text-gray-700">
                I understand the risks involved and agree to the{" "}
                <a
                  href="/terms"
                  className="text-green-600 hover:text-green-500 underline"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/investment-terms"
                  className="text-green-600 hover:text-green-500 underline"
                >
                  Investment Agreement
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-4 text-sm text-red-600">{errors.submit}</div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || !acceptTerms}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Confirm Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
