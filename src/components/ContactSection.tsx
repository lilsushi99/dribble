import { useState, FormEvent, useEffect, useRef } from 'react';
import designerSketchImg from '../assets/images/comic_panel_2_1785513156210.jpg';
import { useSettings } from '../context/SettingsContext';
import { X, CheckCircle, Send, Loader2 } from 'lucide-react';

interface CustomField {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
}

export default function ContactSection() {
  const { settings } = useSettings();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [visitorFirstName, setVisitorFirstName] = useState('');

  // Local Form Inputs State
  const [formInputValues, setFormInputValues] = useState<Record<string, string>>({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    project_type: 'Brand Architecture',
    budget: '',
    message: '',
  });

  // Dynamic CMS Settings with defaults
  const artistImage = settings?.contact_artist_image || designerSketchImg;
  const overlayTitle = settings?.contact_image_title || 'Studio Atelier No. 4';
  const overlaySub = settings?.contact_image_subtitle || 'Monochrome Ink Drafting & Physical Prototypes';
  const formHeading = settings?.contact_form_heading || 'Contact Us Today';
  const formDescription = settings?.contact_form_description || 'Send us a message and receive a response in less than an hour.';
  const submitBtnText = settings?.contact_submit_button_text || 'Start Your Project';

  // Parse Social Links from CMS
  let activeSocialLinks: { label: string; href: string }[] = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Telegram', href: 'https://t.me/comicartstudio' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Twitter/X', href: 'https://twitter.com' },
  ];

  if (settings?.contact_social_links) {
    try {
      const parsed: SocialLink[] = JSON.parse(settings.contact_social_links);
      if (Array.isArray(parsed) && parsed.length > 0) {
        activeSocialLinks = parsed
          .filter((s) => s.enabled)
          .map((s) => ({ label: s.platform, href: s.url }));
      }
    } catch (e) {
      // Fallback
    }
  }

  // Parse Custom Fields from CMS
  let fieldsToRender: CustomField[] = [
    { id: 'first_name', label: 'First Name', name: 'first_name', type: 'text', required: true, placeholder: 'Elena' },
    { id: 'last_name', label: 'Last Name', name: 'last_name', type: 'text', required: true, placeholder: 'Vance' },
    { id: 'email', label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'elena@vanguard.com' },
    { id: 'company', label: 'Company', name: 'company', type: 'text', required: false, placeholder: 'Vanguard Lab' },
    { id: 'project_type', label: 'Project Type', name: 'project_type', type: 'select', required: true, options: ['Brand Architecture', 'Spatial & Interaction', 'Digital Monograph', 'Full Retainer'] },
    { id: 'budget', label: 'Budget Range', name: 'budget', type: 'select', required: true, options: ['$30k - $50k', '$50k - $100k', '$100k - $250k', '$250k+'] },
    { id: 'message', label: 'Project Summary', name: 'message', type: 'textarea', required: true, placeholder: 'Outline key objectives, timeline constraints, and desired outcomes...' },
  ];

  if (settings?.contact_form_fields) {
    try {
      const parsed: CustomField[] = JSON.parse(settings.contact_form_fields);
      if (Array.isArray(parsed) && parsed.length > 0) {
        fieldsToRender = parsed;
      }
    } catch (e) {
      // Fallback
    }
  }

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

  const handleInputChange = (fieldName: string, value: string) => {
    setFormInputValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Extract First Name for personalized confirmation modal
    const rawFirstName =
      formInputValues.first_name ||
      formInputValues.name?.split(' ')[0] ||
      formInputValues.email?.split('@')[0] ||
      'there';
    setVisitorFirstName(rawFirstName);

    try {
      await fetch('/api/v1/forms/1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInputValues),
      });
    } catch (err) {
      console.warn('Backend submission warning:', err);
    } finally {
      setIsSubmitting(false);
      setShowConfirmationModal(true);
    }
  };

  const handleDismissConfirmation = () => {
    setShowConfirmationModal(false);
    // Refresh page / reset form state smoothly as requested
    window.location.reload();
  };

  return (
    <section
      ref={sectionRef}
      id="section-contact-full"
      className="relative w-full min-h-screen py-24 px-6 sm:px-16 bg-[#050505] flex flex-col justify-between overflow-hidden"
    >
      <div ref={parallaxRef} className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-stretch my-auto will-change-transform transition-transform duration-75 ease-out">
        {/* Left Column: Artist Image Container */}
        <div className="md:col-span-5 bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
          <div className="relative flex-1 min-h-[320px] sm:min-h-[380px] w-full rounded-2xl overflow-hidden border border-white/10 bg-black group">
            <img
              src={artistImage}
              alt="Studio designer artwork"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ${
                settings?.contact_image_grayscale === 'true' ? 'filter grayscale' : ''
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 font-inter text-xs text-[#9a9a9e] space-y-1">
              <span className="font-outfit text-sm text-white font-medium block">{overlayTitle}</span>
              <span>{overlaySub}</span>
            </div>
          </div>

          {/* Social Links below image */}
          <div className="space-y-3 pt-1">
            <h4 className="font-outfit text-sm text-white font-medium">Connect & Archives</h4>
            <div className="flex flex-wrap items-center gap-5 font-inter text-xs text-[#9a9a9e]">
              {activeSocialLinks.map((social) => (
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

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7 bg-[#0a0a0c] border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl space-y-8">
          <div className="space-y-2">
            <h2 className="font-outfit text-3xl sm:text-5xl font-light text-[#f3f3f3] tracking-tight">
              {formHeading.includes('Contact') ? (
                <>
                  Contact <span className="text-[#E6A800]">{formHeading.replace(/^Contact\s*/i, '')}</span>
                </>
              ) : (
                formHeading
              )}
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#9a9a9e] leading-relaxed">
              {formDescription}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fieldsToRender.map((field) => {
                const val = formInputValues[field.name] || '';

                if (field.type === 'textarea') {
                  return (
                    <div key={field.id} className="sm:col-span-2">
                      <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                        {field.label} {field.required && <span className="text-[#E6A800]">*</span>}
                      </label>
                      <textarea
                        rows={4}
                        required={field.required}
                        value={val}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  );
                }

                if (field.type === 'select') {
                  return (
                    <div key={field.id} className="sm:col-span-1">
                      <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                        {field.label} {field.required && <span className="text-[#E6A800]">*</span>}
                      </label>
                      <select
                        value={val || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                      >
                        {field.name === 'budget' && (
                          <option value="" disabled>
                            $500
                          </option>
                        )}
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="sm:col-span-1">
                    <label className="block font-inter text-xs text-[#9a9a9e] mb-2">
                      {field.label} {field.required && <span className="text-[#E6A800]">*</span>}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      value={val}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#0097FF] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full py-4 text-sm font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <span>{submitBtnText}</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal Popup */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#0a0a0c] border border-white/15 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={handleDismissConfirmation}
              className="absolute top-5 right-5 p-2 rounded-full text-[#9a9a9e] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-outfit text-2xl sm:text-3xl text-white font-light">
                Inquiry Received
              </h3>
              <p className="font-inter text-sm sm:text-base text-[#9a9a9e] leading-relaxed">
                Hi <span className="font-semibold text-white">{visitorFirstName}</span>, someone from our team will get back to you in less than an hour.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismissConfirmation}
              className="w-full bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full py-3.5 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer shadow-lg shadow-[#0097FF]/20"
            >
              Close & Refresh
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
