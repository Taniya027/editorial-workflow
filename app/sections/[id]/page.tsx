import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function SectionDetail({ id }: { id: string }) {
  const section = await prisma.section.findUnique({
    where: { id },
    include: {
      articles: true,
    },
  });

  if (!section) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">{section.name}</h1>
        <p className="text-slate-400 mt-2">{section.description || "No description provided."}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">Articles in this Section</h2>
        {section.articles.length > 0 ? (
          <div className="grid gap-3">
            {section.articles.map((article) => (
              <div key={article.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-100">{article.title}</h3>
                <span className="text-xs font-mono text-blue-400 uppercase">{article.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No articles found in this section.</p>
        )}
      </div>
    </div>
  );
}

export default async function SectionPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/sections" className="text-sm text-slate-400 hover:text-white mb-6 inline-block">
          ← Back to Sections
        </Link>
        <Suspense fallback={<div className="text-slate-400">Loading section details...</div>}>
          <SectionDetail id={id} />
        </Suspense>
      </div>
    </main>
  );
}