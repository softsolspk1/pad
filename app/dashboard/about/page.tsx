import { ExternalLink } from "lucide-react";

export default function AboutPAD() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="card text-center p-8 border-t-4 border-t-[var(--primary-color)]">
         <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-crimson font-bold text-3xl mx-auto mb-4 border-2 border-red-100">
            PAD
         </div>
         <h2 className="text-3xl font-bold mb-2">Pakistan Association of Dermatologists</h2>
         <p className="text-muted mb-6">Promoting Excellence in Dermatology</p>
         
         <div className="text-left space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
            <p>
              The Pakistan Association of Dermatologists (PAD) is the sole representative body of dermatologists in Pakistan. Established with the vision to promote the science and practice of dermatology, PAD plays a pivotal role in continuous medical education and research.
            </p>
            <p>
              We are dedicated to improving patient care by disseminating knowledge through our official journal (JPAD), national and international conferences, and regular workshops.
            </p>
            <p>
              Our mission is to uphold the highest standards of ethics and professionalism among our members and provide a platform for networking and collaboration.
            </p>
         </div>
         
         <a href="http://www.pad.net.pk/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-8 text-[var(--primary-color)] font-bold hover:underline">
            Visit Official Website <ExternalLink size={16} />
         </a>
      </div>
    </div>
  );
}
