import { Edit2, Image as ImageIcon } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="card overflow-hidden p-0 relative">
         <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-600"></div>
         <div className="px-6 pb-6 pt-16 relative">
            <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              <img src="https://i.pravatar.cc/150?u=dr_ayesha" alt="Profile" className="w-full h-full object-cover" />
              <button className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 flex justify-center hover:bg-opacity-70 transition">
                 <ImageIcon size={14} className="mr-1" /> Change
              </button>
            </div>
            
            <div className="flex justify-end absolute top-4 right-4">
               <button className="btn-outline py-1.5 px-4 text-sm flex items-center gap-2">
                 <Edit2 size={14} /> Edit Profile
               </button>
            </div>
            
            <h2 className="text-2xl font-bold">Dr. Ayesha Khan</h2>
            <p className="text-gray-600 font-medium mb-4">Consultant Dermatologist at DermaCare Clinic, Lahore</p>
            
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 mt-6 border-t pt-6">
               <div>
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Qualification</h4>
                  <p className="text-sm">MBBS, FCPS (Dermatology)</p>
               </div>
               <div>
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Experience</h4>
                  <p className="text-sm">8 Years</p>
               </div>
               <div>
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Areas of Interest</h4>
                  <p className="text-sm">Aesthetic Medicine, Laser Therapy, Pediatric Dermatology</p>
               </div>
               <div>
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">PMDC Number</h4>
                  <p className="text-sm">12345-D</p>
               </div>
            </div>
         </div>
      </div>
      
      <div className="card">
         <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="font-bold text-lg">Publications & Awards</h3>
            <button className="text-[var(--primary-color)] text-sm font-semibold hover:underline">Edit</button>
         </div>
         
         <div className="space-y-4">
            <div>
               <h4 className="font-semibold text-sm">Publications</h4>
               <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                  <li>Comparative study of fractional CO2 laser in acne scars (JPAD, 2025)</li>
                  <li>Efficacy of PRP in androgenetic alopecia (International Journal of Dermatology, 2026)</li>
               </ul>
            </div>
            <div className="pt-2">
               <h4 className="font-semibold text-sm">Awards</h4>
               <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                  <li>Best Young Dermatologist Award - PAD Annual Conference 2024</li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
