"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";

type Post = {
  id: number;
  content: string;
  image_url: string | null;
  created_at: string;
  author_name: string;
  author_designation: string;
  author_photo: string | null;
  like_count: string;
  comment_count: string;
};

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function remove(id: number) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setBusyId(id);
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setBusyId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">News Feed Moderation</h1>
        <p className="text-muted mt-1">{posts.length} post{posts.length === 1 ? "" : "s"} from members.</p>
      </div>

      {loading && <p className="text-muted">Loading...</p>}
      {!loading && posts.length === 0 && <p className="text-muted">No posts yet.</p>}

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="card !rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={p.author_photo || "https://i.pravatar.cc/150?u=" + p.id} alt={p.author_name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{p.author_name}</p>
                  <p className="text-xs text-muted">{p.author_designation} &middot; {new Date(p.created_at).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => remove(p.id)}
                disabled={busyId === p.id}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg disabled:opacity-50"
                aria-label="Delete post"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm mt-3 whitespace-pre-wrap">{p.content}</p>
            {p.image_url && <img src={p.image_url} alt="" className="mt-3 rounded-lg max-h-64 object-cover" />}
            <div className="flex gap-4 mt-3 text-xs text-muted">
              <span className="flex items-center gap-1"><Heart size={13} /> {p.like_count}</span>
              <span className="flex items-center gap-1"><MessageCircle size={13} /> {p.comment_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
