"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen, Activity, Video, Users, Heart, MessageCircle, Send, Loader2,
} from "lucide-react";
import ImageUploadButton from "@/components/ImageUploadButton";

type Post = {
  id: number;
  content: string;
  image_url: string | null;
  created_at: string;
  author_id: number;
  author_name: string;
  author_designation: string;
  author_photo: string | null;
  like_count: string;
  comment_count: string;
  liked_by_me: boolean;
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
  author_id: number;
  author_name: string;
  author_photo: string | null;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DashboardHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentInput, setCommentInput] = useState("");

  async function loadPosts() {
    setLoading(true);
    const res = await fetch("/api/news");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handlePost() {
    if (!content.trim()) return;
    setPosting(true);
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, image_url: imageUrl }),
    });
    if (res.ok) {
      setContent("");
      setImageUrl(null);
      await loadPosts();
    }
    setPosting(false);
  }

  async function toggleLike(postId: number) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked_by_me: !p.liked_by_me, like_count: String(Number(p.like_count) + (p.liked_by_me ? -1 : 1)) }
          : p
      )
    );
    await fetch(`/api/news/${postId}/like`, { method: "POST" });
  }

  function toggleComments(postId: number) {
    setOpenComments((prev) => (prev === postId ? null : postId));
  }

  async function loadComments(postId: number) {
    const res = await fetch(`/api/news/${postId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    }
  }

  useEffect(() => {
    if (openComments !== null && !comments[openComments]) {
      loadComments(openComments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openComments]);

  async function submitComment(postId: number) {
    if (!commentInput.trim()) return;
    const res = await fetch(`/api/news/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentInput }),
    });
    if (res.ok) {
      setCommentInput("");
      await loadComments(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comment_count: String(Number(p.comment_count) + 1) } : p))
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #d32f2f 100%)' }}>
        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Where Experts Connect. Knowledge Evolves. Patients Transform.</h2>
          <p className="text-sm text-red-50">Share updates, ask the community, and stay current with PAD.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/research" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
          <BookOpen size={28} className="text-crimson mb-2" />
          <h4 className="font-bold text-sm">Research</h4>
        </Link>
        <Link href="/dashboard/ai" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
          <Activity size={28} className="text-crimson mb-2" />
          <h4 className="font-bold text-sm">AI Copilot</h4>
        </Link>
        <Link href="/dashboard/membership" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
          <Users size={28} className="text-crimson mb-2" />
          <h4 className="font-bold text-sm">Membership</h4>
        </Link>
        <Link href="/dashboard/events" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
          <Video size={28} className="text-crimson mb-2" />
          <h4 className="font-bold text-sm">Events</h4>
        </Link>
      </div>

      {/* Composer */}
      <div className="card">
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Share a clinical update, case, or news with the network..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3">
          <ImageUploadButton imageUrl={imageUrl} onChange={setImageUrl} />
          <button
            onClick={handlePost}
            disabled={posting || !content.trim()}
            className="btn-primary !py-2 !px-5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div>
        <h3 className="text-xl font-bold mb-4">Latest News Feed</h3>
        {loading ? (
          <div className="text-center text-muted py-10">Loading feed...</div>
        ) : posts.length === 0 ? (
          <div className="card text-center text-muted py-10">No posts yet. Be the first to share something.</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.author_photo || "https://i.pravatar.cc/150?u=" + post.author_id}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{post.author_name}</h4>
                    <p className="text-xs text-muted">{post.author_designation} &middot; {timeAgo(post.created_at)}</p>
                  </div>
                </div>
                <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
                {post.image_url && (
                  <img src={post.image_url} alt="Post" className="w-full max-h-96 object-cover rounded-lg mb-3" />
                )}
                <div className="flex gap-4 text-sm text-muted border-t pt-3 mt-3">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1 hover:text-crimson ${post.liked_by_me ? "text-crimson font-semibold" : ""}`}
                  >
                    <Heart size={16} fill={post.liked_by_me ? "currentColor" : "none"} /> Like ({post.like_count})
                  </button>
                  <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 hover:text-crimson">
                    <MessageCircle size={16} /> Comment ({post.comment_count})
                  </button>
                </div>

                {openComments === post.id && (
                  <div className="mt-3 pt-3 border-t space-y-3">
                    {(comments[post.id] || []).map((c) => (
                      <div key={c.id} className="flex gap-2 text-sm">
                        <img
                          src={c.author_photo || "https://i.pravatar.cc/150?u=" + c.author_id}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          alt={c.author_name}
                        />
                        <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                          <p className="font-semibold text-xs">{c.author_name}</p>
                          <p>{c.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        className="input-field !py-1.5 text-sm"
                        placeholder="Write a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                      />
                      <button onClick={() => submitComment(post.id)} className="btn-primary !py-1.5 !px-3 text-sm">
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
