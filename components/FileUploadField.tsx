"use client";

import { useRef, useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, X, FileText } from "lucide-react";

export default function FileUploadField({
  label,
  field,
  accept,
  onUploaded,
}: {
  label: string;
  field: string;
  accept: string;
  onUploaded: (field: string, url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  async function handleFile(file: File) {
    setFileName(file.name);
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPreviewUrl(data.url);
      setStatus("done");
      onUploaded(field, data.url);
    } catch (err) {
      setStatus("error");
      onUploaded(field, null);
    }
  }

  function reset() {
    setStatus("idle");
    setFileName("");
    setPreviewUrl("");
    onUploaded(field, null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="label text-sm">{label} *</label>
      <div
        className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
          status === "done"
            ? "border-crimson-300 bg-crimson-50"
            : status === "error"
            ? "border-red-400 bg-red-50"
            : "border-gray-200 bg-gray-50 hover:border-crimson-300 hover:bg-crimson-50/40"
        }`}
      >
        {status === "idle" && (
          <label className="flex flex-col items-center gap-1.5 cursor-pointer">
            <UploadCloud size={22} className="text-gray-400" />
            <span className="text-xs text-muted">Click to upload</span>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              required
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        )}

        {status === "uploading" && (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <Loader2 size={22} className="text-crimson-500 animate-spin" />
            <span className="text-xs text-muted truncate max-w-full">{fileName}</span>
          </div>
        )}

        {status === "done" && (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <button
              type="button"
              onClick={reset}
              className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-600"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
            {previewUrl && /\.(jpe?g|png|webp)$/i.test(previewUrl) ? (
              <img src={previewUrl} alt={label} className="w-12 h-12 object-cover rounded-lg" />
            ) : (
              <FileText size={22} className="text-crimson-600" />
            )}
            <span className="flex items-center gap-1 text-xs font-medium text-crimson-700">
              <CheckCircle2 size={13} /> {fileName}
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <span className="text-xs text-red-600">Upload failed. Try again.</span>
            <button type="button" onClick={reset} className="text-xs font-semibold text-crimson-600 hover:underline">
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
