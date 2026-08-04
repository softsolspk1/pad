"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Activity, Sparkles, Users } from "lucide-react";

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push(searchParams.get("next") || "/dashboard");
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Branding panel */}
      <div className="hidden lg:flex flex-col justify-between relative bg-gradient-to-br from-crimson-700 via-crimson-600 to-crimson-800 text-white p-12 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-white/5" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-crimson-600 font-bold">
            R
          </div>
          <span className="font-bold tracking-tight">REDERM CONNECT</span>
        </Link>

        <div className="relative z-10 space-y-8 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Where experts connect, knowledge evolves, and patients transform.
          </h2>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"><ShieldCheck size={18} /></div>
              <p className="text-sm text-crimson-50">Verified PMDC-registered professional network</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"><Sparkles size={18} /></div>
              <p className="text-sm text-crimson-50">AI Dermatology Copilot for evidence-based decisions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"><Activity size={18} /></div>
              <p className="text-sm text-crimson-50">Clinical calculators, research &amp; guidelines</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"><Users size={18} /></div>
              <p className="text-sm text-crimson-50">1,200+ dermatology &amp; aesthetic professionals</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-crimson-100">
          © {new Date().getFullYear()} Pakistan Association of Dermatologists
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-sm w-full">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-full bg-crimson-600 flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="font-bold text-gray-900 tracking-tight">REDERM CONNECT</span>
          </Link>

          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-muted mt-1.5 mb-8">Log in to your professional network</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label">PMDC Number or Email</label>
              <input type="text" name="identifier" className="input-field" placeholder="Enter PMDC Number or Email" required />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label mb-0">Password</label>
                <Link href="/auth/forgot" className="text-sm text-crimson-600 font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input-field pr-11"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-70">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Not registered yet?{" "}
            <Link href="/auth/register" className="text-crimson-600 font-semibold hover:underline">
              Register as Member
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gray-900">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
