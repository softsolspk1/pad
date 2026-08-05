"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Plus, Send, Users, X, Loader2 } from "lucide-react";

type Participant = { id: number; full_name: string; photo_url: string | null };
type Conversation = {
  id: number;
  is_group: boolean;
  name: string | null;
  last_message: string | null;
  last_message_at: string | null;
  other_participants: Participant[];
};
type Message = {
  id: number;
  content: string;
  created_at: string;
  sender_id: number;
  sender_name: string;
  sender_photo: string | null;
};
type DirectoryMember = {
  id: number;
  full_name: string;
  designation: string;
  institute_name: string;
  city: string;
  photo_url: string | null;
};

function conversationTitle(conv: Conversation) {
  if (conv.is_group) return conv.name || "Group Chat";
  return conv.other_participants[0]?.full_name || "Member";
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [meId, setMeId] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [directory, setDirectory] = useState<DirectoryMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((res) => res.json()).then((data) => setMeId(data.id));
  }, []);

  function loadConversations() {
    fetch("/api/chat/conversations")
      .then((res) => res.json())
      .then((data) => setConversations(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  function loadMessages(convId: number) {
    fetch(`/api/chat/conversations/${convId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const interval = setInterval(() => {
      setMessages((prev) => {
        const lastId = prev.length ? prev[prev.length - 1].id : undefined;
        fetch(`/api/chat/conversations/${activeId}/messages${lastId ? `?after=${lastId}` : ""}`)
          .then((res) => res.json())
          .then((data: Message[]) => {
            if (Array.isArray(data) && data.length) {
              setMessages((cur) => [...cur, ...data]);
            }
          });
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || !activeId) return;
    const content = input;
    setInput("");
    const res = await fetch(`/api/chat/conversations/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      loadMessages(activeId);
      loadConversations();
    }
  }

  function openPicker() {
    setShowPicker(true);
    setSelectedIds([]);
    setGroupName("");
    if (!directory.length) {
      fetch("/api/members/directory")
        .then((res) => res.json())
        .then((data) => setDirectory(Array.isArray(data) ? data : []));
    }
  }

  async function startConversation() {
    if (!selectedIds.length) return;
    const isGroup = selectedIds.length > 1;
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantIds: selectedIds, isGroup, name: isGroup ? groupName || "Group Chat" : undefined }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowPicker(false);
      loadConversations();
      setActiveId(data.id);
    }
  }

  const activeConv = conversations.find((c) => c.id === activeId);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4">
      {/* Conversation list */}
      <div className={`w-full md:w-1/3 card p-0 flex flex-col overflow-hidden ${activeId ? "hidden md:flex" : ""}`}>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <button onClick={openPicker} className="text-[var(--primary-color)] p-1 hover:bg-red-50 rounded">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search members..." className="w-full pl-10 pr-4 py-2 border rounded-full text-sm bg-gray-50 focus:outline-none focus:border-[var(--primary-color)]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-center text-sm text-muted p-6">No conversations yet. Tap + to start one.</p>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`p-4 border-b flex items-center gap-3 cursor-pointer transition ${
                activeId === conv.id ? "bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              {conv.is_group ? (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border flex-shrink-0">
                  <Users size={20} />
                </div>
              ) : (
                <img
                  src={conv.other_participants[0]?.photo_url || "https://i.pravatar.cc/150?u=" + conv.id}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm truncate">{conversationTitle(conv)}</h4>
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.last_message || "No messages yet"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active conversation */}
      <div className={`flex-1 card p-0 flex-col overflow-hidden ${activeId ? "flex" : "hidden md:flex"}`}>
        {activeConv ? (
          <>
            <div className="p-4 border-b flex items-center gap-3 bg-white">
              <button onClick={() => setActiveId(null)} className="md:hidden text-gray-500">
                <X size={18} />
              </button>
              {activeConv.is_group ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border">
                  <Users size={18} />
                </div>
              ) : (
                <img src={activeConv.other_participants[0]?.photo_url || "https://i.pravatar.cc/150?u=" + activeConv.id} className="w-10 h-10 rounded-full object-cover" alt="" />
              )}
              <h3 className="font-bold">{conversationTitle(activeConv)}</h3>
            </div>
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg) => {
                const mine = msg.sender_id === meId;
                return (
                  <div key={msg.id} className={`flex gap-2 max-w-[80%] ${mine ? "self-end flex-row-reverse" : ""}`}>
                    {!mine && (
                      <img src={msg.sender_photo || "https://i.pravatar.cc/150?u=" + msg.sender_id} className="w-8 h-8 rounded-full object-cover mt-auto" alt="" />
                    )}
                    <div
                      className={`p-3 rounded-2xl shadow-sm text-sm ${
                        mine
                          ? "bg-[var(--primary-color)] text-white rounded-br-none"
                          : "bg-white border border-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 py-2 px-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} disabled={!input.trim()} className="bg-[var(--primary-color)] text-white p-2 rounded-full disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted text-sm">Select a conversation to start chatting</div>
        )}
      </div>

      {/* New chat picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">New Chat</h3>
              <button onClick={() => setShowPicker(false)}><X size={18} /></button>
            </div>
            {selectedIds.length > 1 && (
              <div className="p-3 border-b">
                <input
                  className="input-field !py-2 text-sm"
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              {directory.length === 0 ? (
                <div className="flex justify-center py-10 text-muted"><Loader2 className="animate-spin" /></div>
              ) : (
                directory.map((m) => (
                  <label key={m.id} className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(m.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) => (e.target.checked ? [...prev, m.id] : prev.filter((id) => id !== m.id)))
                      }
                    />
                    <img src={m.photo_url || "https://i.pravatar.cc/150?u=" + m.id} className="w-9 h-9 rounded-full object-cover" alt="" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{m.full_name}</p>
                      <p className="text-xs text-muted truncate">{m.designation}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <div className="p-4 border-t">
              <button onClick={startConversation} disabled={!selectedIds.length} className="btn-primary w-full disabled:opacity-50">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
