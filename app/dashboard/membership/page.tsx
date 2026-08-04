import { Award, User, Calendar, MapPin } from "lucide-react";

export default function Membership() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Membership</h2>
      
      <div className="max-w-md mx-auto mt-8 relative">
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="h-24 bg-gradient-to-r from-[var(--primary-color)] to-red-600 relative">
               {/* Pattern overlay */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
               <div className="absolute top-4 left-6 text-white font-bold tracking-wider">PAD MEMBER</div>
               <div className="absolute top-4 right-6 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--primary-color)] font-bold">R</div>
            </div>
            
            <div className="px-6 pb-6 pt-16 relative text-center">
               <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md">
                 <img src="https://i.pravatar.cc/150?u=dr_ayesha" alt="Profile" className="w-full h-full object-cover" />
               </div>
               
               <h3 className="text-xl font-bold mt-2 text-gray-900">Dr. Ayesha Khan</h3>
               <p className="text-[var(--primary-color)] font-medium mb-1">Consultant Dermatologist</p>
               <p className="text-sm text-gray-500 mb-6">PMDC: 12345-D</p>
               
               <div className="grid grid-cols-2 gap-4 text-left border-t pt-4">
                 <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin size={12}/> City</p>
                    <p className="font-semibold text-sm">Lahore</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12}/> Member Since</p>
                    <p className="font-semibold text-sm">2022</p>
                 </div>
               </div>
            </div>
         </div>
         
         <div className="mt-8 text-center">
            <button className="btn-primary w-full max-w-xs flex items-center justify-center gap-2 mx-auto">
              <Award size={18} /> Download ID Card
            </button>
         </div>
      </div>
    </div>
  );
}
