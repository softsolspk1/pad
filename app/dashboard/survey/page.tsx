import { ClipboardList, CheckCircle2 } from "lucide-react";

export default function Survey() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Surveys & Polls</h2>
      <p className="text-muted">Participate in clinical surveys to help PAD shape future guidelines.</p>
      
      <div className="space-y-4 mt-6">
         {/* Active Survey */}
         <div className="card border-l-4 border-l-[var(--primary-color)]">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-lg">Use of Biologics in Psoriasis: Current Trends</h3>
                  <p className="text-sm text-gray-500 mt-1">Created by Admin • Closing in 3 days</p>
               </div>
               <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
               </span>
            </div>
            <p className="text-sm text-gray-700 mb-6">
               A short 5-minute survey to understand prescribing patterns for newer IL-17 and IL-23 inhibitors among Pakistani dermatologists.
            </p>
            <button className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
               <ClipboardList size={18} /> Start Survey
            </button>
         </div>

         {/* Completed Survey */}
         <div className="card opacity-70">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-lg">Teledermatology Adoption Post-Pandemic</h3>
                  <p className="text-sm text-gray-500 mt-1">Closed on 15 June 2027</p>
               </div>
               <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Completed
               </span>
            </div>
            <button className="btn-outline w-full md:w-auto text-sm py-1.5">
               View Results Report
            </button>
         </div>
      </div>
    </div>
  );
}
