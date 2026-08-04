import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

export default function Calculators() {
  const calculators = [
    { name: "PASI", desc: "Psoriasis Area and Severity Index" },
    { name: "EASI", desc: "Eczema Area and Severity Index" },
    { name: "SCORAD", desc: "Scoring Atopic Dermatitis" },
    { name: "DLQI", desc: "Dermatology Life Quality Index" },
    { name: "BSA", desc: "Body Surface Area" },
    { name: "GAGS", desc: "Global Acne Grading System" },
    { name: "Hurley Stage", desc: "Hidradenitis Suppurativa Staging" },
    { name: "MASI", desc: "Melasma Area and Severity Index" },
    { name: "NAPSI", desc: "Nail Psoriasis Severity Index" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
         <h2 className="text-2xl font-bold">Clinical Calculators & Scoring</h2>
         <p className="text-muted mt-1">Standardized tools for accurate clinical assessment.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
         {calculators.map((calc, i) => (
            <Link href="#" key={i} className="card hover:border-[var(--primary-color)] hover:shadow-md transition-all cursor-pointer group">
               <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-crimson group-hover:text-red-700">{calc.name}</h3>
                  <Activity size={18} className="text-gray-400 group-hover:text-[var(--primary-color)]" />
               </div>
               <p className="text-sm text-gray-600 mb-4">{calc.desc}</p>
               <div className="flex items-center text-xs font-semibold text-[var(--primary-color)]">
                  Launch Tool <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
               </div>
            </Link>
         ))}
      </div>
    </div>
  );
}
