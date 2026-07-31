import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FooterSection from './components/FooterSection';
import CustomCursor from './components/CustomCursor';
import LiquidMembrane from './components/LiquidMembrane';
import BookCallModal from './components/BookCallModal';
import ProjectModal from './components/ProjectModal';

import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';

import { Project } from './types';

export default function App() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine active route name for Navbar highlight
  const getActiveRoute = () => {
    const path = location.pathname;
    if (path === '/studio') return 'studio';
    if (path === '/projects') return 'projects';
    if (path === '/blog') return 'blog';
    if (path === '/contact') return 'contact';
    return 'home';
  };

  const handleNavigate = (route: string) => {
    if (route === 'home') navigate('/');
    else if (route === 'studio') navigate('/studio');
    else if (route === 'projects') navigate('/projects');
    else if (route === 'blog') navigate('/blog');
    else if (route === 'contact') navigate('/contact');
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f3f3f3] font-inter selection:bg-[#0097FF]/30 selection:text-white flex flex-col justify-between">
      {/* Custom Cursor & Liquid Membrane Effects */}
      <CustomCursor />
      <LiquidMembrane />

      {/* Navbar with centered navigation links */}
      <Navbar
        currentRoute={getActiveRoute()}
        onNavigate={handleNavigate}
        onOpenBookCall={() => setIsBookCallOpen(true)}
      />

      {/* Main View Area */}
      <div className="w-full flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenBookCall={() => setIsBookCallOpen(true)}
                onNavigateToProjects={() => navigate('/projects')}
                onSelectProject={(proj) => setSelectedProject(proj)}
              />
            }
          />
          <Route
            path="/studio"
            element={
              <StudioPage
                onOpenBookCall={() => setIsBookCallOpen(true)}
                onNavigateToProjects={() => navigate('/projects')}
              />
            }
          />
          <Route
            path="/projects"
            element={
              <ProjectsPage
                onSelectProject={(proj) => setSelectedProject(proj)}
                onOpenBookCall={() => setIsBookCallOpen(true)}
                onNavigateToContact={() => navigate('/contact')}
              />
            }
          />
          <Route
            path="/blog"
            element={
              <BlogPage
                onOpenBookCall={() => setIsBookCallOpen(true)}
              />
            }
          />
          <Route
            path="/contact"
            element={<ContactPage />}
          />
        </Routes>
      </div>

      {/* Universal Footer */}
      <FooterSection
        onNavigate={(target) => handleNavigate(target)}
        onOpenBookCall={() => setIsBookCallOpen(true)}
      />

      {/* Book a Call Modal */}
      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
