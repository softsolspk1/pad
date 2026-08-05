"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-sm w-full card !rounded-2xl !bg-white">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white mx-auto mb-4">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Admin Console</h2>
          <p className="text-muted mt-1.5 text-sm">PAD APP &middot; PAD Administration</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">Admin Email</label>
            <input type="email" name="email" className="input-field" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" className="input-field" required />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-70">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted hover:text-gray-900">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
