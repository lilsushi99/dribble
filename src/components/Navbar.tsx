import { useState } from 'react';
import kineticLogo from '../assets/images/kinetic_logo.svg';

interface NavbarProps {
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  onOpenBookCall?: () => void;
}

export default function Navbar({ currentRoute = 'home', onNavigate, onOpenBookCall }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'studio', label: 'Studio' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 sm:px-12 py-6 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative pointer-events-auto">
        {/* Left: Studio Image Logo */}
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => handleNavClick('home')}
            className="group text-left flex items-center cursor-pointer focus:outline-none"
            aria-label="KINETIC Studio Home"
          >
            <img
              src={kineticLogo}
              alt="KINETIC Studio Logo"
              className="h-6 sm:h-7 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
            />
          </button>
        </div>

        {/* Center: Desktop Navigation Links horizontally centered */}
        <nav className="hidden md:flex items-center justify-center bg-[#050505]/80 backdrop-blur-md px-7 py-2.5 rounded-full border border-white/10 shadow-2xl">
          <div className="flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-inter text-xs lg:text-sm tracking-wide transition-colors duration-200 cursor-pointer ${
                  currentRoute === item.id
                    ? 'text-white font-medium'
                    : 'text-[#9a9a9e] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Right: Primary CTA Button & Mobile Hamburger */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <button
            onClick={onOpenBookCall}
            className="hidden sm:inline-flex items-center gap-2 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
          >
            <span>Chat With Us</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 text-[#9a9a9e] hover:text-white focus:outline-none cursor-pointer bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-3 bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col space-y-3 font-inter text-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-2 border-b border-white/5 ${
                  currentRoute === item.id ? 'text-white font-medium' : 'text-[#9a9a9e]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBookCall?.();
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0097FF] text-white rounded-full py-3 text-xs font-medium cursor-pointer"
          >
            <span>Chat With Us</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
