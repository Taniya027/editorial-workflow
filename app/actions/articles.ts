"use server";

import { getArticles, GetArticlesQueryOptions } from "@/lib/articles";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Import your authOptions

export async function fetchArticlesAction(
  params: Omit<GetArticlesQueryOptions, "userId" | "userRole">
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Cast user to access custom fields (id, role)
  const user = session.user as { id: string; role: "EDITOR" | "WRITER" };

  return await getArticles({
    ...params,
    userId: user.id,
    userRole: user.role,
  });
}