"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  XMarkIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

// Opportunity creation validation schema
const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  detailedPlan: z
    .string()
    .min(50, "Detailed plan must be at least 50 characters")
    .max(5000, "Detailed plan is too long"),
  targetCapital: z
    .number()
    .min(1000, "Target capital must be at least ₦1,000")
    .max(1000000000, "Target capital cannot exceed ₦1B"),
  minimumInvestment: z
    .number()
    .min(100, "Minimum investment must be at least ₦100"),
  expectedROI: z
    .number()
    .min(0, "Expected ROI cannot be negative")
    .max(1000, "Expected ROI cannot exceed 1000%"),
  timeline: z
    .number()
    .min(1, "Timeline must be at least 1 month")
    .max(120, "Timeline cannot exceed 120 months"),
  industry: z.string().min(1, "Industry is required"),
  riskLevel: z.enum(["Low", "Medium", "High"]),
});

interface OpportunityCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const industryOptions = [
  "Technology",
  "Agriculture",
  "Healthcare",
  "Manufacturing",
  "Energy",
  "Transportation",
  "Real Estate",
  "Education",
  "Finance",
  "Retail",
  "Entertainment",
  "Other",
];

const riskLevelOptions = [
  {
    value: "Low",
    label: "Low",
    description: "Stable returns with minimal risk",
  },
  { value: "Medium", label: "Medium", description: "Balanced risk and reward" },
  {
    value: "High",
    label: "High",
    description: "Higher potential returns with increased risk",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function OpportunityCreationModal({
  isOpen,
  onClose,
  onSuccess,
}: OpportunityCreationModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailedPlan: "",
    targetCapital: "",
    minimumInvestment: "",
    expectedROI: "",
    timeline: "",
    industry: "",
    riskLevel: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number) => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) stepErrors.title = "Title is required";
      if (!formData.description.trim())
        stepErrors.description = "Description is required";
      if (!formData.industry) stepErrors.industry = "Industry is required";
    } else if (step === 2) {
      if (!formData.targetCapital)
        stepErrors.targetCapital = "Target capital is required";
      if (!formData.minimumInvestment)
        stepErrors.minimumInvestment = "Minimum investment is required";
      if (!formData.expectedROI)
        stepErrors.expectedROI = "Expected ROI is required";
      if (!formData.timeline) stepErrors.timeline = "Timeline is required";
      if (!formData.riskLevel) stepErrors.riskLevel = "Risk level is required";

      // Validate minimum investment vs target capital
      const targetCapital = parseFloat(formData.targetCapital);
      const minimumInvestment = parseFloat(formData.minimumInvestment);

      if (minimumInvestment > targetCapital) {
        stepErrors.minimumInvestment =
          "Minimum investment cannot be greater than target capital";
      }
    } else if (step === 3) {
      if (!formData.detailedPlan.trim())
        stepErrors.detailedPlan = "Detailed plan is required";
      if (formData.detailedPlan.length < 50)
        stepErrors.detailedPlan =
          "Detailed plan must be at least 50 characters";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.role !== "BUSINESS_OWNER") {
      setErrors({ submit: "Only business owners can create opportunities" });
      return;
    }

    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert string values to numbers
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        detailedPlan: formData.detailedPlan.trim(),
        targetCapital: parseFloat(formData.targetCapital),
        minimumInvestment: parseFloat(formData.minimumInvestment),
        expectedROI: parseFloat(formData.expectedROI),
        timeline: parseInt(formData.timeline),
        industry: formData.industry,
        riskLevel: formData.riskLevel,
      };

      // Validate with Zod
      opportunitySchema.parse(submissionData);

      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create opportunity");
      }

      const result = await response.json();

      // Success feedback
      alert(`Opportunity "${formData.title}" created successfully!`);

      // Reset form
      setFormData({
        title: "",
        description: "",
        detailedPlan: "",
        targetCapital: "",
        minimumInvestment: "",
        expectedROI: "",
        timeline: "",
        industry: "",
        riskLevel: "",
      });
      setCurrentStep(1);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Opportunity creation error:", error);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({
          submit:
            error instanceof Error
              ? error.message
              : "Failed to create opportunity. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalSteps = 3;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Create Investment Opportunity
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index + 1 < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opportunity Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Lagos Tech Innovation Hub"
                        maxLength={200}
                      />
                      {errors.title && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Brief description of your investment opportunity"
                        maxLength={1000}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.description && (
                          <p className="text-red-600 text-sm">
                            {errors.description}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm ml-auto">
                          {formData.description.length}/1000
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry *
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select an industry</option>
                        {industryOptions.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.industry}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financial Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Financial Details
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Capital (₦) *
                        </label>
                        <div className="relative">
                          <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.targetCapital}
                            onChange={(e) =>
                              handleInputChange("targetCapital", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="50000000"
                            min="1000"
                            max="1000000000"
                          />
                        </div>
                        {formData.targetCapital && (
                          <p className="text-sm text-gray-500 mt-1">
                            {formatCurrency(
                              parseFloat(formData.targetCapital) || 0
                            )}
                          </p>
                        )}
                        {errors.targetCapital && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.targetCapital}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Investment (₦) *
                        </label>
                        <div className="relative">
                          <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.minimumInvestment}
                            onChange={(e) =>
                              handleInputChange(
                                "minimumInvestment",
                                e.target.value
                              )
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="500000"
                            min="100"
                          />
                        </div>
                        {formData.minimumInvestment && (
                          <p className="text-sm text-gray-500 mt-1">
                            {formatCurrency(
                              parseFloat(formData.minimumInvestment) || 0
                            )}
                          </p>
                        )}
                        {errors.minimumInvestment && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.minimumInvestment}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected ROI (%) *
                        </label>
                        <div className="relative">
                          <ChartBarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.expectedROI}
                            onChange={(e) =>
                              handleInputChange("expectedROI", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="18"
                            min="0"
                            max="1000"
                            step="0.1"
                          />
                        </div>
                        {errors.expectedROI && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.expectedROI}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timeline (months) *
                        </label>
                        <div className="relative">
                          <CalendarDaysIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.timeline}
                            onChange={(e) =>
                              handleInputChange("timeline", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="24"
                            min="1"
                            max="120"
                          />
                        </div>
                        {errors.timeline && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.timeline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risk Level *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {riskLevelOptions.map((option) => (
                          <div
                            key={option.value}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              formData.riskLevel === option.value
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onClick={() =>
                              handleInputChange("riskLevel", option.value)
                            }
                          >
                            <div className="font-medium text-gray-900">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {option.description}
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.riskLevel && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.riskLevel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Detailed Plan */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Detailed Business Plan
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detailed Plan *
                    </label>
                    <p className="text-sm text-gray-600 mb-2">
                      Provide a comprehensive description of your business
                      opportunity, including: market analysis, revenue model,
                      competitive advantages, and use of funds.
                    </p>
                    <textarea
                      value={formData.detailedPlan}
                      onChange={(e) =>
                        handleInputChange("detailedPlan", e.target.value)
                      }
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Describe your business opportunity in detail..."
                      maxLength={5000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.detailedPlan && (
                        <p className="text-red-600 text-sm">
                          {errors.detailedPlan}
                        </p>
                      )}
                      <p className="text-gray-500 text-sm ml-auto">
                        {formData.detailedPlan.length}/5000
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Summary Preview
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Title:</span>
                      <p className="font-medium">
                        {formData.title || "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Industry:</span>
                      <p className="font-medium">
                        {formData.industry || "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Target Capital:</span>
                      <p className="font-medium">
                        {formData.targetCapital
                          ? formatCurrency(parseFloat(formData.targetCapital))
                          : "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected ROI:</span>
                      <p className="font-medium">
                        {formData.expectedROI
                          ? `${formData.expectedROI}%`
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <InformationCircleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Opportunity"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
