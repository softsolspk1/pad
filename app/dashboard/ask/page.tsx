"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import ImageUploadButton from "@/components/ImageUploadButton";

type Thread = {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author_id: number;
  author_name: string;
  author_designation: string;
  author_photo: string | null;
  reply_count: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AskExpertPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  function loadThreads() {
    setLoading(true);
    fetch("/api/expert-threads")
      .then((res) => res.json())
      .then((data) => setThreads(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadThreads();
  }, []);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;
    setPosting(true);
    const res = await fetch("/api/expert-threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, image_url: imageUrl }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      setImageUrl(null);
      setShowForm(false);
      loadThreads();
    }
    setPosting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Ask the Expert</h2>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary py-2 px-4 text-sm">
          {showForm ? "Cancel" : "Start Discussion"}
        </button>
      </div>

      {showForm && (
        <div className="card space-y-3">
          <input
            className="input-field"
            placeholder="Title (e.g. Unusual presentation of...)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Discuss a case or ask a question to the network..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <ImageUploadButton imageUrl={imageUrl} onChange={setImageUrl} />
            <button
              onClick={handleSubmit}
              disabled={posting || !title.trim() || !content.trim()}
              className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Post
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-muted"><Loader2 className="animate-spin" /></div>
      ) : threads.length === 0 ? (
        <div className="card text-center text-muted py-10">No discussions yet. Start one above.</div>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <Link href={`/dashboard/ask/${thread.id}`} key={thread.id} className="card block hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={thread.author_photo || "https://i.pravatar.cc/150?u=" + thread.author_id}
                    alt={thread.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{thread.author_name}</h4>
                    <p className="text-xs text-muted">{thread.author_designation} &middot; {timeAgo(thread.created_at)}</p>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{thread.title}</h3>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{thread.content}</p>
              {thread.image_url && (
                <img src={thread.image_url} alt="" className="w-full max-h-56 object-cover rounded-lg mb-4" />
              )}
              <div className="flex gap-6 text-sm text-gray-500 border-t pt-3">
                <span className="flex items-center gap-1"><MessageCircle size={16} /> {thread.reply_count} Replies</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
