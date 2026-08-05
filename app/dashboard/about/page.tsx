import { ExternalLink, MapPin, Phone, Mail, Target, History, Users } from "lucide-react";

export default function AboutPAD() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="card text-center p-8 border-t-4 border-t-[var(--primary-color)]">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-crimson font-bold text-3xl mx-auto mb-4 border-2 border-red-100">
          PAD
        </div>
        <h2 className="text-3xl font-bold mb-2">Pakistan Association of Dermatologists</h2>
        <p className="text-muted mb-6">Promoting Excellence in Dermatology since 1979</p>

        <div className="text-left space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
          <p>
            The Pakistan Association of Dermatologists (PAD) provides a platform for the dermatologists of the
            country to meet their colleagues and advance the specialty. Founded in January 1979 by Dr. Nusrat Ali
            Shaikh and Dr. Syed Ghulam Shabbir, PAD emerged at a time when dermatology in Pakistan had to be built
            almost from the ground up &mdash; in the years after independence, specialist care was scarce and only
            venereology clinics and general lectures on skin disease were available.
          </p>
          <p>
            Since then, PAD has grown into the sole representative body of dermatologists in Pakistan, dedicated to
            promoting regular scientific meetings, encouraging research and scientific presentations, improving
            patient care, advancing dermatology education at all levels, and working with government authorities on
            matters of dermatology policy.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <Target className="mx-auto text-crimson mb-2" size={24} />
          <h3 className="font-bold text-sm mb-1">Mission</h3>
          <p className="text-xs text-muted">Advancing dermatology practice, research and education across Pakistan.</p>
        </div>
        <div className="card text-center">
          <History className="mx-auto text-crimson mb-2" size={24} />
          <h3 className="font-bold text-sm mb-1">Est. 1979</h3>
          <p className="text-xs text-muted">Nearly five decades representing Pakistan's dermatology community.</p>
        </div>
        <div className="card text-center">
          <Users className="mx-auto text-crimson mb-2" size={24} />
          <h3 className="font-bold text-sm mb-1">Nationwide Network</h3>
          <p className="text-xs text-muted">Connecting dermatology &amp; aesthetic professionals across the country.</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg mb-4">Contact PAD</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-crimson flex-shrink-0 mt-0.5" />
            <span>PMA House, Abdullah Haroon Road, Karachi, Pakistan</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-crimson flex-shrink-0" />
            <span>+92 21 32226464 &middot; +92 344 2445596</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-crimson flex-shrink-0" />
            <span>info@pad.net.pk</span>
          </div>
        </div>

        <a
          href="http://www.pad.net.pk/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-[var(--primary-color)] font-bold hover:underline text-sm"
        >
          Visit Official Website <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
