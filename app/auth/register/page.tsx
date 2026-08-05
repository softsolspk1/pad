"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import FileUploadField from "@/components/FileUploadField";
import { COUNTRIES, PROVINCES, PAKISTAN_CITIES } from "@/lib/locations";

const REQUIRED_DOCS = ["photo", "mbbs", "cnic", "degree"] as const;
type DocKey = (typeof REQUIRED_DOCS)[number];

const DOC_FIELD_MAP: Record<DocKey, string> = {
  photo: "photo_url",
  mbbs: "mbbs_certificate_url",
  cnic: "cnic_copy_url",
  degree: "degree_url",
};

export default function Register() {
  const [country, setCountry] = useState("Pakistan");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    photo: null,
    mbbs: null,
    cnic: null,
    degree: null,
  });

  function handleUploaded(field: string, url: string | null) {
    setDocs((prev) => ({ ...prev, [field as DocKey]: url }));
  }

  const allDocsUploaded = REQUIRED_DOCS.every((key) => docs[key]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = Object.fromEntries(formData.entries()) as Record<string, string>;

    if (payload.password !== payload.confirm_password) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }
    delete payload.confirm_password;

    for (const key of REQUIRED_DOCS) {
      payload[DOC_FIELD_MAP[key]] = docs[key] ?? "";
    }

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full card !rounded-2xl text-center py-10">
          <div className="w-14 h-14 rounded-full bg-crimson-50 text-crimson-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Submitted</h2>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Thank you for registering with PAD APP. Your application has been sent to the PAD admin team for
            review. You'll be notified by email once your account is approved and your digital membership card is
            ready.
          </p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full object-cover mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Join PAD APP</h2>
          <p className="text-muted mt-2">Register as a member of Pakistan Association of Dermatologists platform</p>
          <div className="inline-flex items-center gap-2 bg-crimson-50 text-crimson-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-crimson-100 mt-4">
            <ShieldCheck size={14} /> Reviewed &amp; approved by PAD admin
          </div>
        </div>

        <form className="card !rounded-2xl space-y-8" onSubmit={handleSubmit}>
          {/* Personal details */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-4">Personal Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Doctor's Name *</label>
                <input type="text" name="full_name" className="input-field" placeholder="Full Name" required />
              </div>
              <div>
                <label className="label">Father's / Husband's Name *</label>
                <input type="text" name="father_husband_name" className="input-field" placeholder="Name" required />
              </div>
              <div>
                <label className="label">Designation *</label>
                <input type="text" name="designation" className="input-field" placeholder="e.g., Consultant Dermatologist" required />
              </div>
              <div>
                <label className="label">Gender *</label>
                <select name="gender" className="input-field bg-white" required defaultValue="">
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Date of Birth *</label>
                <input type="date" name="date_of_birth" className="input-field" required />
              </div>
              <div>
                <label className="label">CNIC Number *</label>
                <input type="text" name="cnic_number" className="input-field" placeholder="XXXXX-XXXXXXX-X" required />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-4 border-t pt-6">Residence</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Member Residence *</label>
                <select name="member_residence" className="input-field bg-white" required defaultValue="">
                  <option value="" disabled>Select Residence</option>
                  <option value="pakistan">Pakistan</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div>
                <label className="label">Country *</label>
                <select
                  name="country"
                  className="input-field bg-white"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Province *</label>
                <select name="province" className="input-field bg-white" required defaultValue="">
                  <option value="" disabled>Select Province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">City *</label>
                {country === "Pakistan" ? (
                  <select name="city" className="input-field bg-white" required defaultValue="">
                    <option value="" disabled>Select City</option>
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" name="city" className="input-field" placeholder="City" required />
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Home Address *</label>
              <textarea name="home_address" className="input-field" rows={2} required></textarea>
            </div>
          </section>

          {/* Professional */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-4 border-t pt-6">Professional Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Institute / Clinic Name *</label>
                <input type="text" name="institute_name" className="input-field" required />
              </div>
              <div>
                <label className="label">PMDC Number *</label>
                <input type="text" name="pmdc_number" className="input-field" required />
              </div>
              <div>
                <label className="label">Phone (with WhatsApp) *</label>
                <input type="tel" name="phone" className="input-field" placeholder="+92 3XX XXXXXXX" required />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input type="email" name="email" className="input-field" required />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Institute / Clinic Address *</label>
              <textarea name="institute_address" className="input-field" rows={2} required></textarea>
            </div>
          </section>

          {/* Account */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-4 border-t pt-6">Account Password</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Set Password *</label>
                <input type="password" name="password" className="input-field" placeholder="At least 8 characters" minLength={8} required />
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input type="password" name="confirm_password" className="input-field" placeholder="Re-enter password" minLength={8} required />
              </div>
            </div>
          </section>

          {/* Attachments */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-1 border-t pt-6">Mandatory Attachments</h3>
            <p className="text-xs text-muted mb-4">All documents are uploaded securely and reviewed by the admin team.</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <FileUploadField label="Profile Photograph" field="photo" accept="image/*" onUploaded={handleUploaded} />
              <FileUploadField label="MBBS Certificate" field="mbbs" accept=".pdf,image/*" onUploaded={handleUploaded} />
              <FileUploadField label="CNIC Copy" field="cnic" accept=".pdf,image/*" onUploaded={handleUploaded} />
              <FileUploadField label="Post Graduate Degree" field="degree" accept=".pdf,image/*" onUploaded={handleUploaded} />
            </div>
          </section>

          <div className="bg-crimson-50 p-4 rounded-xl text-sm text-crimson-700">
            <p className="font-semibold">Note:</p>
            <p>After submission, your registration will be reviewed by the Admin. Upon approval, you will be notified to login, and your Digital Membership Card will be generated.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !allDocsUploaded}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : allDocsUploaded ? "Submit Registration" : "Upload all documents to continue"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gray-900">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
