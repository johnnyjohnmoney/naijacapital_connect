"use client";

import OpportunityList from "@/components/OpportunityList";

export default function OpportunitiesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <OpportunityList
          showSearch={true}
          limit={12}
          showPagination={true}
          title="Investment Opportunities"
          description="Discover pre-vetted Nigerian business opportunities"
          compact={false}
        />
      </div>
    </div>
  );
}
