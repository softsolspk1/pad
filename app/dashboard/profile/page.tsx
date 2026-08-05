"use client";

import { useEffect, useState } from "react";
import { Edit2, Loader2, Check, X } from "lucide-react";
import ImageUploadButton from "@/components/ImageUploadButton";

type Profile = {
  id: number;
  full_name: string;
  designation: string;
  institute_name: string;
  city: string;
  photo_url: string;
  membership_number: string;
  qualification: string | null;
  clinic_hospital: string | null;
  experience: string | null;
  areas_of_interest: string | null;
  publications: string | null;
  awards: string | null;
  social_links: Record<string, string> | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm(data);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qualification: form.qualification,
        clinic_hospital: form.clinic_hospital,
        experience: form.experience,
        areas_of_interest: form.areas_of_interest,
        publications: form.publications,
        awards: form.awards,
        photo_url: form.photo_url,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      setEditing(false);
    }
    setSaving(false);
  }

  if (!profile) {
    return <div className="flex justify-center py-16 text-muted"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="card overflow-hidden p-0 relative">
        <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-600" />
        <div className="px-6 pb-6 pt-16 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            <img src={(editing ? form.photo_url : profile.photo_url) || profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {editing && (
            <div className="absolute top-20 left-6">
              <ImageUploadButton imageUrl={null} onChange={(url) => url && setForm((prev) => ({ ...prev, photo_url: url }))} />
            </div>
          )}

          <div className="flex justify-end absolute top-4 right-4">
            {editing ? (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(false); setForm(profile); }} className="btn-outline py-1.5 px-3 text-sm flex items-center gap-1">
                  <X size={14} /> Cancel
                </button>
                <button onClick={save} disabled={saving} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1 disabled:opacity-50">
                  <Check size={14} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-outline py-1.5 px-4 text-sm flex items-center gap-2">
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>

          <h2 className="text-2xl font-bold">{profile.full_name}</h2>
          <p className="text-gray-600 font-medium mb-4">
            {profile.designation} at {profile.institute_name}{profile.city ? `, ${profile.city}` : ""}
          </p>

          <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 mt-6 border-t pt-6">
            <ProfileField
              label="Qualification"
              value={form.qualification}
              editing={editing}
              placeholder="e.g. MBBS, FCPS (Dermatology)"
              onChange={(v) => setForm((prev) => ({ ...prev, qualification: v }))}
            />
            <ProfileField
              label="Experience"
              value={form.experience}
              editing={editing}
              placeholder="e.g. 8 Years"
              onChange={(v) => setForm((prev) => ({ ...prev, experience: v }))}
            />
            <ProfileField
              label="Clinic / Hospital"
              value={form.clinic_hospital}
              editing={editing}
              placeholder="e.g. DermaCare Clinic"
              onChange={(v) => setForm((prev) => ({ ...prev, clinic_hospital: v }))}
            />
            <ProfileField
              label="Areas of Interest"
              value={form.areas_of_interest}
              editing={editing}
              placeholder="e.g. Aesthetic Medicine, Laser Therapy"
              onChange={(v) => setForm((prev) => ({ ...prev, areas_of_interest: v }))}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="font-bold text-lg">Publications & Awards</h3>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Publications</h4>
            {editing ? (
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="One per line"
                value={form.publications || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, publications: e.target.value }))}
              />
            ) : profile.publications ? (
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {profile.publications.split("\n").filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted">No publications added yet.</p>
            )}
          </div>
          <div className="pt-2">
            <h4 className="font-semibold text-sm mb-2">Awards</h4>
            {editing ? (
              <textarea
                className="input-field resize-none"
                rows={2}
                placeholder="One per line"
                value={form.awards || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, awards: e.target.value }))}
              />
            ) : profile.awards ? (
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {profile.awards.split("\n").filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted">No awards added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  editing,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string | null;
  editing: boolean;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</h4>
      {editing ? (
        <input className="input-field !py-1.5 text-sm" placeholder={placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <p className="text-sm">{value || <span className="text-muted">Not set</span>}</p>
      )}
    </div>
  );
}
