import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-100 text-center">
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Editorial Workflow System</h1>
      <p className="text-slate-400 max-w-md mb-8">
        Production-ready Next.js application with role-based access control, article lifecycles, and audit trails.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/sections" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white transition"
        >
          View Dashboard
        </Link>
        <Link 
          href="/api/auth/signin" 
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg font-semibold text-slate-200 transition"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}