import { useState, FormEvent, useEffect, useRef } from 'react';
import designerSketchImg from '../assets/images/comic_panel_2_1785513156210.jpg';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (sectionRef.current && parallaxRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const translateY = (scrollProgress - 0.5) * -18;
            parallaxRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Brand Architecture',
    budget: '$50k - $100k',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: 'Brand Architecture',
        budget: '$50k - $100k',
        message: '',
      });
    }, 4000);
  };

  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Behance', href: 'https://behance.net' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'X / Twitter', href: 'https://twitter.com' },
  ];

  return (
    <section
      ref={sectionRef}
      id="section-contact-full"
      className="relative w-full min-h-screen py-24 px-6 sm:px-16 bg-[#050505] flex flex-col justify-between overflow-hidden"
    >
      <div ref={parallaxRef} className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-stretch my-auto will-change-transform transition-transform duration-75 ease-out">
        {/* Left Column: Artist Image Container matching Form Container height */}
        <div className="md:col-span-5 bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
          <div className="relative flex-1 min-h-[320px] sm:min-h-[380px] w-full rounded-2xl overflow-hidden border border-white/10 bg-black group">
            <img
              src={designerSketchImg}
              alt="Studio designer sketching artwork"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 font-inter text-xs text-[#9a9a9e] space-y-1">
              <span className="font-outfit text-sm text-white font-medium block">Studio Atelier No. 4</span>
              <span>Monochrome Ink Drafting & Physical Prototypes</span>
            </div>
          </div>

          {/* Social Links below image inside matching height card */}
          <div className="space-y-3 pt-1">
            <h4 className="font-outfit text-sm text-white font-medium">Connect & Archives</h4>
            <div className="flex flex-wrap items-center gap-5 font-inter text-xs text-[#9a9a9e]">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Elegant Contact Form */}
        <div className="md:col-span-7 bg-[#0a0a0c] border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl space-y-8">
          <div className="space-y-2">
            <h2 className="font-outfit text-3xl sm:text-5xl font-light text-[#f3f3f3] tracking-tight">
              Contact <span className="text-[#E6A800]">Us Today</span>
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#9a9a9e] leading-relaxed">
              Send us a message and receive a response in less than one hour.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 border border-[#0097FF]/30 rounded-2xl bg-[#0097FF]/10 p-8">
              <h3 className="font-outfit text-2xl text-white font-light">Commission Received</h3>
              <p className="font-inter text-sm text-[#9a9a9e]">
                Thank you for your interest. Our partners will review your project parameters and respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Elena Vance"
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@vanguard.com"
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Vanguard Lab"
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option>Brand Architecture</option>
                    <option>Spatial & Interaction</option>
                    <option>Digital Monograph</option>
                    <option>Full Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                    Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option>$30k - $50k</option>
                    <option>$50k - $100k</option>
                    <option>$100k - $250k</option>
                    <option>$250k+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                  Message & Scope Summary
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline key objectives, timeline constraints, and desired outcomes..."
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full py-4 text-sm font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
              >
                <span>Start Your Project</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
