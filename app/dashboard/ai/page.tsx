"use client";
import { useState, useRef, useEffect } from "react";
import { Activity, Send, Loader2, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello Doctor. I am Derma AI. How can I assist you with clinical guidelines, treatment options, or case analysis today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error occurred." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Best treatment for severe melasma?",
    "Latest fungal infection guideline",
    "Differential diagnosis of facial rash"
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--primary-color)] to-red-700 p-4 text-white flex items-center gap-3">
         <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Activity size={24} />
         </div>
         <div>
            <h2 className="font-bold text-lg leading-tight">Derma AI</h2>
            <p className="text-xs text-red-100">Evidence-based clinical assistant</p>
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 flex flex-col gap-6">
         {messages.map((msg, idx) => (
           <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-200' : 'bg-red-100 text-[var(--primary-color)]'}`}>
                 {msg.role === 'user' ? <User size={16}/> : <Activity size={18}/>}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-white border border-gray-200 shadow-sm text-gray-800 rounded-tr-sm' : 'bg-white border-l-4 border-l-[var(--primary-color)] shadow-sm text-gray-800 rounded-tl-sm prose prose-sm max-w-none'}`}>
                 {msg.role === 'user' ? (
                   msg.content
                 ) : (
                   <div className="whitespace-pre-wrap">{msg.content.replace(/\*\*/g, '').replace(/\*/g, '• ')}</div>
                 )}
              </div>
           </div>
         ))}
         {isLoading && (
           <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[var(--primary-color)] flex-shrink-0 flex items-center justify-center">
                 <Activity size={18}/>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-[var(--primary-color)]" />
                 <span className="text-sm text-gray-500">Analyzing clinical data...</span>
              </div>
           </div>
         )}
         <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t">
         {messages.length === 1 && (
           <div className="flex flex-wrap gap-2 mb-4">
              {sampleQuestions.map((q, i) => (
                 <button 
                   key={i} 
                   onClick={() => setInput(q)}
                   className="text-xs bg-red-50 text-[var(--primary-color)] px-3 py-1.5 rounded-full border border-red-100 hover:bg-[var(--primary-color)] hover:text-white transition"
                 >
                   {q}
                 </button>
              ))}
           </div>
         )}
         <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about guidelines, treatments, or differential diagnosis..." 
              className="flex-1 input-field"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[var(--primary-color)] text-white px-4 rounded-lg flex items-center justify-center hover:bg-red-800 transition disabled:opacity-50"
            >
               <Send size={18} />
            </button>
         </div>
         <p className="text-[10px] text-center text-gray-400 mt-2">
           Derma AI provides evidence-based suggestions but does not replace clinical judgment.
         </p>
      </div>
    </div>
  );
}
