"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

type Reply = {
  id: number;
  content: string;
  created_at: string;
  author_id: number;
  author_name: string;
  author_photo: string | null;
};

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
  replies: Reply[];
};

export default function ThreadDetailPage() {
  const params = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  function loadThread() {
    fetch(`/api/expert-threads/${params.id}`)
      .then((res) => res.json())
      .then((data) => setThread(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function submitReply() {
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/expert-threads/${params.id}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply }),
    });
    if (res.ok) {
      setReply("");
      loadThread();
    }
    setSending(false);
  }

  if (loading) {
    return <div className="flex justify-center py-16 text-muted"><Loader2 className="animate-spin" /></div>;
  }

  if (!thread) {
    return <div className="card text-center text-muted py-10">Thread not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/ask" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gray-900">
        <ArrowLeft size={16} /> Back to Ask the Expert
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={thread.author_photo || "https://i.pravatar.cc/150?u=" + thread.author_id}
            alt={thread.author_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-sm">{thread.author_name}</h4>
            <p className="text-xs text-muted">{thread.author_designation}</p>
          </div>
        </div>
        <h1 className="font-bold text-xl mb-2">{thread.title}</h1>
        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{thread.content}</p>
        {thread.image_url && <img src={thread.image_url} alt="" className="w-full rounded-lg" />}
      </div>

      <div>
        <h3 className="font-bold mb-3">{thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}</h3>
        <div className="space-y-3">
          {thread.replies.map((r) => (
            <div key={r.id} className="flex gap-3">
              <img
                src={r.author_photo || "https://i.pravatar.cc/150?u=" + r.author_id}
                alt={r.author_name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex-1">
                <p className="font-semibold text-xs mb-0.5">{r.author_name}</p>
                <p className="text-sm">{r.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 sticky bottom-4">
        <input
          className="input-field"
          placeholder="Write a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitReply()}
        />
        <button onClick={submitReply} disabled={sending || !reply.trim()} className="btn-primary !px-4 disabled:opacity-50">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
