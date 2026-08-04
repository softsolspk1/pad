"use client";
import { useState } from "react";
import { Book, FileText, Download, Bookmark } from "lucide-react";

export default function Research() {
  const [activeTab, setActiveTab] = useState("papers");
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Research & Resources</h2>
      
      <div className="flex border-b border-gray-200 mb-6">
         <button 
           onClick={() => setActiveTab("papers")}
           className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'papers' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
           Research Papers
         </button>
         <button 
           onClick={() => setActiveTab("ebooks")}
           className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'ebooks' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
           E-Books
         </button>
         <button 
           onClick={() => setActiveTab("guidelines")}
           className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'guidelines' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
           Guidelines
         </button>
      </div>

      <div className="space-y-4">
         <div className="card border-l-4 border-l-[var(--primary-color)] flex gap-4">
            <div className="hidden sm:flex items-center justify-center p-3 bg-red-50 rounded-lg text-crimson w-16 h-16">
               <FileText size={32} />
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg mb-1">Efficacy of novel topical therapies for Melasma</h3>
                  <button className="text-gray-400 hover:text-[var(--primary-color)]"><Bookmark size={20}/></button>
               </div>
               <p className="text-sm text-gray-600 mb-2">Journal of Pakistan Association of Dermatologists - Vol 34, Issue 2</p>
               <p className="text-xs text-gray-500 mb-4 line-clamp-2">This study evaluates the comparative efficacy of tranexamic acid versus triple combination cream in epidermal melasma in a South Asian population cohort over 12 weeks...</p>
               <button className="btn-outline text-xs px-3 py-1.5 flex items-center gap-2">
                 <Download size={14} /> Download PDF (1.2 MB)
               </button>
            </div>
         </div>

         <div className="card border-l-4 border-l-[var(--primary-color)] flex gap-4">
            <div className="hidden sm:flex items-center justify-center p-3 bg-red-50 rounded-lg text-crimson w-16 h-16">
               <Book size={32} />
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg mb-1">Dermatology in Practice (3rd Edition)</h3>
                  <button className="text-[var(--primary-color)]"><Bookmark fill="currentColor" size={20}/></button>
               </div>
               <p className="text-sm text-gray-600 mb-2">Open-Source E-Book Library</p>
               <button className="btn-outline text-xs px-3 py-1.5 flex items-center gap-2 mt-4">
                 <Book size={14} /> Read Online
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
