"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

export default function ImageUploadButton({
  imageUrl,
  onChange,
}: {
  imageUrl: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) onChange(data.url);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (imageUrl) {
    return (
      <div className="relative inline-block">
        <img src={imageUrl} alt="Upload preview" className="h-20 rounded-lg object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-500 hover:text-red-600"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-xs font-medium text-crimson-600 border border-dashed border-crimson-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-crimson-50">
      {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
      {uploading ? "Uploading..." : "Add photo"}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </label>
  );
}
