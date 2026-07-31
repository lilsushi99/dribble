import { useState, FormEvent } from 'react';
import { X, Check } from 'lucide-react';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookCallModal({ isOpen, onClose }: BookCallModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    scope: 'Brand Identity',
    budget: '$50k - $100k',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0a0a0d] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-white/30 text-[#9a9a9e] hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 bg-[#2b5c8f]/20 border border-[#2b5c8f] text-[#2b5c8f] rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-outfit text-2xl text-white font-light">Inquiry Confirmed</h3>
            <p className="font-inter text-sm text-[#9a9a9e]">
              Thank you. Our partner team will review your project requirements and respond within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="font-outfit text-2xl sm:text-3xl text-[#f3f3f3] font-light">
                Initiate <span className="text-[#E6A800]">Studio Commission</span>
              </h3>
              <p className="font-inter text-sm text-[#9a9a9e]">
                Provide key details regarding your vision and schedule.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Elena Vance"
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@vanguard.com"
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-1.5">
                    Organization / Brand
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Vanguard Design Lab"
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-1.5">
                    Primary Scope
                  </label>
                  <select
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option>Brand Identity Architecture</option>
                    <option>Spatial & Interaction Design</option>
                    <option>Digital Product Engineering</option>
                    <option>Full Creative Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-inter text-xs text-[#9a9a9e] mb-1.5">
                  Brief Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us about the project goals, target launch timeline, and key deliverables..."
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full py-3.5 text-sm font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
              >
                <span>Submit Commission Request</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
