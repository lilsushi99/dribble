import { useEffect } from 'react';
import ContactSection from '../components/ContactSection';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-12 bg-[#050505]">
      <ContactSection />
    </div>
  );
}
