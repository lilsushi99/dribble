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
  const [homeContent, setHomeContent] = useState<HomepageContent>(defaultHomepageData);
  const { settings } = useSettings();

  useSeo('homepage');

  useEffect(() => {
    let isMounted = true;
    adminApi.getHomepageData().then((data) => {
      if (isMounted && data) setHomeContent(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
