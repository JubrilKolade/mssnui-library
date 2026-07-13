"use client";

import { useState, useEffect } from "react";
import { CategoryChart } from "./CategoryChart";
import { Skeleton } from "../../ui/skeleton";
import { ActivityFeed } from "./ActivityFeed";
import { DistributionCharts } from "./DistributionCharts";
import { DownloadsChart } from "./DownloadsChart";
import { OverviewCards } from "./OverviewCards";
import { RegistrationsChart } from "./RegistrationsChart";
import { TopContentTables } from "./TopContentTables";

export function AnalyticsDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [topContent, setTopContent] = useState<any>(null);
  const [distribution, setDistribution] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setIsLoading(true);

      const [
        overviewRes,
        downloadsRes,
        registrationsRes,
        topContentRes,
        distributionRes,
        activityRes,
      ] = await Promise.all([
        fetch("/api/admin/analytics/overview"),
        fetch("/api/admin/analytics/downloads?days=30"),
        fetch("/api/admin/analytics/registrations?months=6"),
        fetch("/api/admin/analytics/top-content"),
        fetch("/api/admin/analytics/distribution"),
        fetch("/api/admin/analytics/activity"),
      ]);

      const [
        overviewData,
        downloadsData,
        registrationsData,
        topContentData,
        distributionData,
        activityData,
      ] = await Promise.all([
        overviewRes.json(),
        downloadsRes.json(),
        registrationsRes.json(),
        topContentRes.json(),
        distributionRes.json(),
        activityRes.json(),
      ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (downloadsData.success) setDownloads(downloadsData.data);
      if (registrationsData.success)
        setRegistrations(registrationsData.data);
      if (topContentData.success) setTopContent(topContentData.data);
      if (distributionData.success) setDistribution(distributionData.data);
      if (activityData.success) setActivity(activityData.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      {overview && <OverviewCards data={overview} />}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DownloadsChart data={downloads} />
        <RegistrationsChart data={registrations} />
      </div>

      {/* Distribution Charts */}
      {distribution && (
        <DistributionCharts data={distribution} />
      )}

      {distribution && distribution.booksByCategory.length > 0 && (
        <CategoryChart data={distribution.booksByCategory} />
       )}

      {/* Top Content + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {topContent && <TopContentTables data={topContent} />}
        </div>
        <div>
          {activity && <ActivityFeed data={activity} />}
        </div>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>

      {/* More skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}