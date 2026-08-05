"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me?as=admin").then((res) => (res.ok ? res.json() : null)).then(setAdmin);
  }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted mt-1">Manage your admin account.</p>
      </div>

      <div className="card !rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{admin?.name ?? "Admin"}</p>
          <p className="text-sm text-muted">{admin?.email}</p>
        </div>
      </div>

      <form onSubmit={changePassword} className="card !rounded-2xl space-y-4">
        <h3 className="font-bold text-gray-900">Change Password</h3>
        <div>
          <label className="label text-sm">Current Password</label>
          <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label className="label text-sm">New Password</label>
          <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
        </div>
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={saving} className="btn-primary !py-2 !px-4 text-sm disabled:opacity-60">
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
