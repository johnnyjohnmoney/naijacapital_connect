import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import InvestmentCalculator from "@/components/InvestmentCalculator";

export default async function CalculatorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Investment Calculator
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Plan your investments and analyze potential returns with our
              comprehensive calculator.
            </p>
          </div>
          <InvestmentCalculator />
        </div>
      </div>
    </div>
  );
}
