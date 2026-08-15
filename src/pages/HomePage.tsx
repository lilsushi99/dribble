import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import ComicSection from '../components/ComicSection';
import { MarqueeSection } from '../components/MarqueeSection';
import ProjectsSection from '../components/ProjectsSection';
import StudioSection from '../components/StudioSection';
import FaqSection from '../components/FaqSection';
import ContactSection from '../components/ContactSection';
import { Project } from '../types';
import { adminApi, defaultHomepageData } from '../admin/services/adminApi';
import { HomepageContent } from '../admin/types/admin.types';
import { useSeo } from '../hooks/useSeo';
import { useTrackPageView } from '../hooks/useTrackPageView';

import { useSettings } from '../context/SettingsContext';

interface HomePageProps {
  onOpenBookCall: () => void;
  onNavigateToProjects: () => void;
  onSelectProject: (project: Project) => void;
}

export default function HomePage({
  onOpenBookCall,
  onNavigateToProjects,
  onSelectProject,
}: HomePageProps) {
  const [homeContent, setHomeContent] = useState<HomepageContent | null>(null);
  const { settings, loading: settingsLoading } = useSettings();

  useSeo('homepage');
  useTrackPageView('home');

  useEffect(() => {
    let isMounted = true;
    adminApi.getHomepageData().then((data) => {
      if (isMounted) setHomeContent(data || defaultHomepageData);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isReady = homeContent !== null && !settingsLoading;

  if (!isReady) {
    // Neutral placeholder matching the Hero section's own background — avoids ever
    // flashing stale/default content while the real data loads, without introducing
    // a spinner or skeleton UI that looks out of place.
    return <div className="min-h-screen w-full bg-black" />;
  }

  return (
    <main className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection
        onOpenBookCall={onOpenBookCall}
        onViewProjects={onNavigateToProjects}
        homeContent={homeContent}
      />

      {/* 2. Comic Panel Section */}
      <ComicSection />

      {/* 2.5 Creative Discipline Dual Ribbon Marquee */}
      <MarqueeSection words={homeContent.marquee_items_json} speed={parseInt(settings?.marquee_speed || '30', 10) || 30} />

      {/* 3. Featured Projects Section */}
      <ProjectsSection
        onSelectProject={onSelectProject}
        onViewAllProjects={onNavigateToProjects}
      />

      {/* 4. Studio Preview Section */}
      <StudioSection />

      {/* 5. FAQ Section */}
      <FaqSection onOpenBookCall={onOpenBookCall} />

      {/* 6. Contact CTA Section */}
      <ContactSection />
    </main>
  );
}
