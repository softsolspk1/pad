"use client";
import { useState } from "react";
import { Calendar, Clock, MapPin, Video, ArrowRight } from "lucide-react";

export default function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold text-crimson">Events</h2>
      </div>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
         <button 
           onClick={() => setActiveTab("upcoming")}
           className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'upcoming' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
         >
           Upcoming Events
         </button>
         <button 
           onClick={() => setActiveTab("live")}
           className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'live' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
         >
           Live Webinars
         </button>
         <button 
           onClick={() => setActiveTab("past")}
           className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'past' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
         >
           Past Events
         </button>
      </div>

      <div className="space-y-4">
        {/* Event Card 1 */}
        <div className="card p-0 overflow-hidden flex flex-col md:flex-row border border-red-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-full md:w-48 h-32 md:h-auto bg-gray-200 relative">
             <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Event" />
             <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold text-crimson">LIVE WEBINAR</div>
           </div>
           <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                 <h3 className="font-bold text-lg mb-1">Advances in Acne Management: Beyond the Basics</h3>
                 <p className="text-sm text-gray-600 mb-2">Dr. Sarah Ahmed</p>
                 <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14}/> 15 July 2027</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> 08:00 PM</span>
                 </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-crimson font-semibold text-sm flex items-center gap-1 hover:underline">
                   Register Now <ArrowRight size={16} />
                </button>
              </div>
           </div>
        </div>

        {/* Event Card 2 */}
        <div className="card p-0 overflow-hidden flex flex-col md:flex-row border border-red-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-full md:w-48 h-32 md:h-auto bg-gray-200 relative">
             <img src="https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Event" />
             <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold text-crimson">CONFERENCE</div>
           </div>
           <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                 <h3 className="font-bold text-lg mb-1">Rederm Aesthetics Summit 2027</h3>
                 <p className="text-sm text-gray-600 mb-2">Innovate. Integrate. Inspire.</p>
                 <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14}/> 20–22 July 2027</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> Lahore, Pakistan</span>
                 </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-crimson font-semibold text-sm flex items-center gap-1 hover:underline">
                   View Details <ArrowRight size={16} />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
