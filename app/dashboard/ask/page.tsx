import { MessageCircle, ThumbsUp, Image as ImageIcon, Send } from "lucide-react";

export default function AskExpert() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold">Ask the Expert</h2>
         <button className="btn-primary py-2 px-4 text-sm">Start Discussion</button>
      </div>
      
      {/* New Post Input */}
      <div className="card p-4 flex gap-4">
         <img src="https://i.pravatar.cc/150?u=dr_ayesha" alt="Profile" className="w-10 h-10 rounded-full" />
         <div className="flex-1">
            <textarea 
               className="input-field mb-2" 
               rows={2} 
               placeholder="Discuss a case or ask a question to the network..."
               style={{ resize: 'none' }}
            ></textarea>
            <div className="flex justify-between items-center">
               <button className="text-gray-500 hover:text-[var(--primary-color)] p-2 rounded-full hover:bg-gray-100 transition">
                  <ImageIcon size={20} />
               </button>
               <button className="bg-[var(--primary-color)] text-white p-2 px-4 rounded-full font-semibold flex items-center gap-2 hover:bg-red-800 transition">
                  Post <Send size={16} />
               </button>
            </div>
         </div>
      </div>

      {/* Forum Post */}
      <div className="space-y-4 mt-8">
         <div className="card">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=dr_khan" alt="Dr. Khan" className="w-10 h-10 rounded-full" />
                  <div>
                     <h4 className="font-bold text-sm">Dr. Tariq Khan</h4>
                     <p className="text-xs text-muted">Consultant, Islamabad • 3 hrs ago</p>
                  </div>
               </div>
               <span className="bg-red-100 text-crimson text-xs px-2 py-1 rounded font-bold">CASE DISCUSSION</span>
            </div>
            
            <h3 className="font-bold text-lg mb-2">Unusual presentation of Pityriasis Rosea</h3>
            <p className="text-sm text-gray-700 mb-4">
               Seeing a 24-year-old male with lesions primarily concentrated on the face and neck, sparing the trunk. VDRL is negative. Any colleagues seen similar inverse presentations recently? Attached lesion morphology for reference.
            </p>
            
            <div className="bg-gray-100 h-40 rounded-lg mb-4 flex items-center justify-center text-gray-400">
               [Clinical Image Placeholder]
            </div>
            
            <div className="flex gap-6 text-sm text-gray-500 border-t pt-3 mt-4">
               <button className="flex items-center gap-1 hover:text-[var(--primary-color)]"><ThumbsUp size={16}/> 12</button>
               <button className="flex items-center gap-1 hover:text-[var(--primary-color)]"><MessageCircle size={16}/> 4 Replies</button>
            </div>
         </div>
      </div>
    </div>
  );
}
