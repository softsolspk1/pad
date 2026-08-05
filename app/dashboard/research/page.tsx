"use client";

import { useEffect, useState } from "react";
import { Book, FileText, ScrollText, Download, Loader2 } from "lucide-react";

type ResearchItem = {
  id: number;
  category: string;
  title: string;
  description: string | null;
  author_or_source: string | null;
  file_url: string | null;
  published_date: string | null;
};

const TABS = [
  { key: "paper", label: "Research Papers", icon: FileText },
  { key: "ebook", label: "E-Books", icon: Book },
  { key: "guideline", label: "Guidelines", icon: ScrollText },
] as const;

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<"paper" | "ebook" | "guideline">("paper");
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/research?category=${activeTab}`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Research & Resources</h2>

      <div className="flex border-b border-gray-200 mb-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.key
                ? "border-[var(--primary-color)] text-[var(--primary-color)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted"><Loader2 className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="card text-center text-muted py-10">No items in this section yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = TABS.find((t) => t.key === item.category)?.icon || FileText;
            return (
              <div key={item.id} className="card border-l-4 border-l-[var(--primary-color)] flex gap-4">
                <div className="hidden sm:flex items-center justify-center p-3 bg-red-50 rounded-lg text-crimson w-16 h-16 flex-shrink-0">
                  <Icon size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  {item.author_or_source && <p className="text-sm text-gray-600 mb-2">{item.author_or_source}</p>}
                  {item.description && <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.description}</p>}
                  {item.file_url && (
                    <a href={item.file_url} target="_blank" rel="noreferrer" className="btn-outline text-xs px-3 py-1.5 inline-flex items-center gap-2">
                      <Download size={14} /> Open
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
