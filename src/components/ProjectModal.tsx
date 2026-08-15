import { useEffect } from 'react';
import { Project } from '../types';
import { X, ArrowRight } from 'lucide-react';
import { adminApi } from '../admin/services/adminApi';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      adminApi.trackEvent('project_view', String(project.id));
    }
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0a0d] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full border border-white/10 hover:border-white/30 text-[#9a9a9e] hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 font-inter text-xs text-[#9a9a9e]">
            <span>{project.client}</span>
            <span>•</span>
            <span className="text-[#c5a880]">{project.year}</span>
            <span>•</span>
            <span>{project.category}</span>
          </div>

          <h2 className="font-outfit text-3xl sm:text-5xl text-[#f3f3f3] font-light">
            {project.title}
          </h2>
        </div>

        {/* Featured Image */}
        <div className="relative w-full max-h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-black">
          <img
            src={project.imageUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-white/10">
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-outfit text-xl text-white font-light">Project Scope & Philosophy</h4>
            <p className="font-inter text-sm sm:text-base text-[#9a9a9e] leading-relaxed">
              {project.description} Engineered with bespoke typography systems, material-driven layout geometry, and custom physical interaction patterns.
            </p>
          </div>

          <div className="space-y-4 bg-[#050505] p-5 rounded-2xl border border-white/10">
            <div className="font-inter text-xs text-[#9a9a9e] space-y-2">
              <div className="flex justify-between">
                <span>Client:</span>
                <span className="text-white font-medium">{project.client}</span>
              </div>
              <div className="flex justify-between">
                <span>Year:</span>
                <span className="text-white font-medium">{project.year}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-white font-medium">{project.category}</span>
              </div>
            </div>

            <a
              href={project.route}
              className="inline-flex items-center justify-center gap-2.5 w-full bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full py-3 text-xs font-medium tracking-wide transition-all duration-300 active:scale-95"
            >
              <span>Explore Full Case Study</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
