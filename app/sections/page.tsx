import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

async function SectionsList() {
  await connection();
  const sections = await prisma.section.findMany();

  return (
    <div className="grid gap-4">
      {sections.map((section) => (
        <Link
          key={section.id}
          href={`/sections/${section.id}`}
          className="block p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all group"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300">
              {section.name}
            </h2>
            <span className="text-xs font-mono text-slate-500 group-hover:text-slate-400">
              View Details →
            </span>
          </div>
          {section.description && (
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              {section.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

export default function SectionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editorial Sections</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage category assignments and editorial workflows
            </p>
          </div>
          <Link
            href="/sections/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow transition-colors"
          >
            + Create New Section
          </Link>
        </div>

        <Suspense fallback={<div className="text-slate-400">Loading sections...</div>}>
          <SectionsList />
        </Suspense>
      </div>
    </main>
  );
}