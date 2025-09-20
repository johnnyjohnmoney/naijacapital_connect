"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import InvestorDashboard from "@/components/dashboards/InvestorDashboard";
import BusinessOwnerDashboard from "@/components/dashboards/BusinessOwnerDashboard";
import AdministratorDashboard from "@/components/dashboards/AdministratorDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirecting
  }

  // Get user role from session
  const userRole = session.user?.role as string;

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case "ADMINISTRATOR":
        return <AdministratorDashboard />;
      case "BUSINESS_OWNER":
        return <BusinessOwnerDashboard user={session.user} />;
      case "INVESTOR":
      default:
        return <InvestorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
}
