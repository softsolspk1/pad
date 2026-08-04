import { Search, Plus, MessageCircle } from "lucide-react";

export default function Chat() {
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row gap-4">
      {/* Sidebar for chat list */}
      <div className="w-full md:w-1/3 card p-0 flex flex-col overflow-hidden">
         <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">Messages</h2>
               <button className="text-[var(--primary-color)] p-1 hover:bg-red-50 rounded"><Plus size={20}/></button>
            </div>
            <div className="relative">
               <input type="text" placeholder="Search members..." className="w-full pl-10 pr-4 py-2 border rounded-full text-sm bg-gray-50 focus:outline-none focus:border-[var(--primary-color)]" />
               <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto">
            {/* Chat Item Active */}
            <div className="p-4 border-b flex items-center gap-3 bg-red-50 cursor-pointer">
               <div className="relative">
                 <img src="https://i.pravatar.cc/150?u=dr_ahmed" alt="User" className="w-12 h-12 rounded-full object-cover" />
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-bold text-sm truncate">Dr. Ahmed Ali</h4>
                     <span className="text-xs text-[var(--primary-color)] font-medium">10:42 AM</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate font-semibold">Yes, I'll send the clinical trial data shortly.</p>
               </div>
               <div className="w-5 h-5 bg-[var(--primary-color)] rounded-full text-white text-[10px] flex items-center justify-center font-bold">2</div>
            </div>
            
            {/* Group Chat Item */}
            <div className="p-4 border-b flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition">
               <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border">
                 PG
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-bold text-sm truncate">PAD Executive Group</h4>
                     <span className="text-xs text-gray-400">Yesterday</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">Dr. Sana: The agenda for tomorrow's meeting...</p>
               </div>
            </div>
            
            {/* Chat Item */}
            <div className="p-4 border-b flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition">
               <div className="relative">
                 <img src="https://i.pravatar.cc/150?u=dr_sara" alt="User" className="w-12 h-12 rounded-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-bold text-sm truncate">Dr. Sara Mahmud</h4>
                     <span className="text-xs text-gray-400">Mon</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">Thank you for the reference!</p>
               </div>
            </div>
         </div>
      </div>
      
      {/* Chat Area (Hidden on mobile by default) */}
      <div className="hidden md:flex flex-1 card p-0 flex-col overflow-hidden">
         <div className="p-4 border-b flex items-center gap-3 bg-white">
             <img src="https://i.pravatar.cc/150?u=dr_ahmed" alt="User" className="w-10 h-10 rounded-full object-cover" />
             <div>
                <h3 className="font-bold">Dr. Ahmed Ali</h3>
                <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online</p>
             </div>
         </div>
         <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4">
             {/* Received Msg */}
             <div className="flex gap-2 max-w-[80%]">
                <img src="https://i.pravatar.cc/150?u=dr_ahmed" alt="User" className="w-8 h-8 rounded-full object-cover mt-auto" />
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-sm border border-gray-100">
                   Hi Dr. Ayesha, did you check the new guidelines for pediatric eczema?
                </div>
             </div>
             {/* Sent Msg */}
             <div className="flex gap-2 max-w-[80%] self-end flex-row-reverse">
                <div className="bg-[var(--primary-color)] text-white p-3 rounded-2xl rounded-br-none shadow-sm text-sm">
                   Not yet, I was planning to review them this weekend. Could you share the link?
                </div>
             </div>
             {/* Received Msg */}
             <div className="flex gap-2 max-w-[80%]">
                <img src="https://i.pravatar.cc/150?u=dr_ahmed" alt="User" className="w-8 h-8 rounded-full object-cover mt-auto" />
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-sm border border-gray-100">
                   Yes, I'll send the clinical trial data shortly.
                </div>
             </div>
         </div>
         <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2">
               <button className="text-gray-400 hover:text-[var(--primary-color)] p-2"><Plus size={20}/></button>
               <input type="text" placeholder="Type a message..." className="flex-1 py-2 px-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
               <button className="bg-[var(--primary-color)] text-white p-2 rounded-full"><MessageCircle size={18}/></button>
            </div>
         </div>
      </div>
    </div>
  );
}
