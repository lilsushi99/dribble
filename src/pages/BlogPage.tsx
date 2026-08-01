import { useEffect } from 'react';
import p1Img from '../assets/images/project_artwork_1_1785513185877.jpg';
import p2Img from '../assets/images/project_artwork_2_1785513204720.jpg';
import p3Img from '../assets/images/project_artwork_3_1785513218624.jpg';
import p4Img from '../assets/images/hero_nebula_bg_1785513124347.jpg';

interface BlogPageProps {
  onOpenBookCall: () => void;
}

export default function BlogPage({ onOpenBookCall }: BlogPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredPost = {
    id: 'b-featured',
    title: 'Architectural Inertia in Digital Interfaces: Beyond Disposable SaaS Aesthetics',
    date: 'JULY 28, 2026',
    readTime: '7 MIN READ',
    image: p4Img,
    category: 'FEATURED MONOGRAPH',
    excerpt:
      'Why modern interactive architecture must abandon ephemeral glassmorphism and spring physics in favor of material mass, tactile friction, and structural weight that lasts across decades.',
    author: 'Evelyn Kuroda',
    authorRole: 'Design Partner',
  };

  const articles = [
    {
      id: 'b1',
      title: 'Sequential Manga Panels as UI Storyboarding Frameworks',
      date: 'JULY 14, 2026',
      readTime: '8 MIN READ',
      image: p1Img,
      category: 'CONCEPTUAL METHODOLOGY',
      excerpt:
        'Translating Japanese manga panel pacing, gutter tension, and high-contrast ink techniques into high-conversion digital narrative arcs.',
      author: 'Kenji Sato',
    },
    {
      id: 'b2',
      title: 'The Death of Disposable Web Templates',
      date: 'JUNE 29, 2026',
      readTime: '5 MIN READ',
      image: p2Img,
      category: 'BRAND ARCHITECTURE',
      excerpt:
        'How homogenized AI generators are driving visionary founders back toward bespoke editorial typography, custom shader physics, and physical brand monuments.',
      author: 'Marcus Vance',
    },
    {
      id: 'b3',
      title: 'Obsidian & Titanium: Materials of Digital Permanence',
      date: 'JUNE 11, 2026',
      readTime: '6 MIN READ',
      image: p3Img,
      category: 'PHYSICAL & SPATIAL CRAFT',
      excerpt:
        'A study on physical craftsmanship, tactile hardware interfaces, and spatial acoustic pavilions constructed for high-net-worth archives.',
      author: 'Julian Thorne',
    },
  ];

  return (
    <div className="pt-28 pb-20 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto space-y-20 bg-[#050505] text-[#f3f3f3]">
      {/* Page Title */}
      <div className="space-y-4 max-w-3xl pt-8">
        <h1 className="font-outfit text-4xl sm:text-6xl font-light text-white tracking-tight leading-[1.08]">
          Our Archive of <span className="text-[#E6A800]">Stories & Thoughts</span>
        </h1>
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e] font-normal leading-relaxed">
          Insights, behind-the-scenes perspectives, comic development breakdowns, illustration processes, and visual storytelling essays published by Comic Art Studio.
        </p>
      </div>

      {/* Large Featured Article at Top */}
      <div className="group relative bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[460px] overflow-hidden">
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent lg:hidden" />
        </div>

        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-inter text-xs text-[#9a9a9e]">
              <span className="text-[#E6A800] uppercase tracking-wider font-medium">
                {featuredPost.category}
              </span>
              <span>{featuredPost.date}</span>
            </div>

            <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-light text-white group-hover:text-white/90 transition-colors leading-tight">
              {featuredPost.title}
            </h2>

            <p className="font-inter text-sm sm:text-base text-[#9a9a9e] leading-relaxed">
              {featuredPost.excerpt}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="font-inter text-xs text-[#9a9a9e]">
              <span className="text-white block font-medium">{featuredPost.author}</span>
              <span>{featuredPost.authorRole}</span>
            </div>

            <button
              onClick={() => { window.location.href = '/'; }}
              className="inline-flex items-center gap-2 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-300 cursor-pointer active:scale-95"
            >
              <span>Read Article</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Clean Editorial Grid of Articles */}
      <div className="pt-8 border-t border-white/10 space-y-8">
        <h2 className="font-outfit text-2xl sm:text-3xl font-light text-white tracking-tight">
          Recent Monographs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group bg-[#0a0a0c] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#050505]">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between font-inter text-xs text-[#9a9a9e]">
                    <span className="text-[#E6A800] uppercase tracking-wider font-medium">
                      {art.category}
                    </span>
                    <span>{art.date}</span>
                  </div>

                  <h3 className="font-outfit text-xl font-light text-white group-hover:text-white/90 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="font-inter text-xs sm:text-sm text-[#9a9a9e] leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between font-inter text-xs text-[#9a9a9e]">
                <span>By {art.author}</span>
                <button
                  onClick={() => { window.location.href = '/'; }}
                  className="inline-flex items-center gap-2 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <span>Read Article</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Journal Subscription CTA */}
      <div className="pt-16 pb-8 border-t border-white/10 text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="font-outfit text-3xl sm:text-5xl font-light text-white tracking-tight">
          Subscribe to <span className="text-[#E6A800]">Comic Art Studio Journal</span>
        </h2>
        <p className="font-inter text-sm sm:text-base text-[#9a9a9e]">
          Quarterly dispatches on design theory, motion architecture, and studio research published on Substack.
        </p>
        <div className="pt-2">
          <button
            onClick={() => window.open('https://substack.com', '_blank')}
            className="inline-flex items-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer active:scale-98"
          >
            <span>Subscribe on Substack</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

