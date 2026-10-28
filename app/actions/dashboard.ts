"use server";

import { getDashboardMetrics } from "@/lib/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function fetchDashboardMetricsAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await getDashboardMetrics();
}