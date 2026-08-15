import { useEffect } from 'react';
import ContactSection from '../components/ContactSection';
import { useSeo } from '../hooks/useSeo';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function ContactPage() {
  useSeo('contact');
  useTrackPageView('contact');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-12 bg-[#050505]">
      <ContactSection />
    </div>
  );
}
