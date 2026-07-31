import kineticLogo from '../assets/images/kinetic_logo.svg';

interface FooterSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenBookCall: () => void;
}

export default function FooterSection({ onNavigate }: FooterSectionProps) {
  const quickLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Studio', id: 'studio' },
    { label: 'Projects', id: 'projects' },
    { label: 'Blog', id: 'blog' },
    { label: 'Contact', id: 'contact' },
  ];

  const socialLinks = [
    { label: 'X / Twitter', url: 'https://twitter.com' },
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <footer
      id="section-footer"
      className="relative w-full py-16 px-6 sm:px-16 bg-[#050505] flex flex-col justify-between"
    >
      {/* Footer Main Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Studio Image Logo & Short Description */}
        <div className="md:col-span-6 space-y-5">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer text-left focus:outline-none"
            aria-label="KINETIC Studio Home"
          >
            <img
              src={kineticLogo}
              alt="KINETIC Studio Logo"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </button>

          <p className="font-inter text-sm text-[#9a9a9e] max-w-sm leading-relaxed">
            An independent creative studio engineering brand architecture, bespoke digital monuments, and physical motion design with uncompromising editorial craft.
          </p>
        </div>

        {/* Right Columns: Quick Links & Social Links */}
        <div className="md:col-span-6 grid grid-cols-2 gap-8 font-inter text-xs">
          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="font-outfit text-sm text-white font-medium">Quick Links</h4>
            <ul className="space-y-2.5 text-[#9a9a9e]">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div className="space-y-4">
            <h4 className="font-outfit text-sm text-white font-medium">Social Archives</h4>
            <ul className="space-y-2.5 text-[#9a9a9e]">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Attribution */}
      <div className="max-w-7xl mx-auto w-full pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 font-inter text-xs text-[#9a9a9e]">
        <div>© {new Date().getFullYear()} KINETIC Studio Ltd. All rights reserved.</div>
        <div>
          Designed by <span className="text-white font-medium">KINETIC Atelier</span>
        </div>
      </div>
    </footer>
  );
}
