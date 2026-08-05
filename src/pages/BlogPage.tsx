import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, defaultBlogPosts } from '../admin/services/adminApi';
import { BlogPostItem } from '../admin/types/admin.types';
import { useSettings } from '../context/SettingsContext';

interface BlogPageProps {
  onOpenBookCall?: () => void;
}

export default function BlogPage({ onOpenBookCall }: BlogPageProps) {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [posts, setPosts] = useState<BlogPostItem[]>(defaultBlogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await adminApi.getBlogPosts();
        if (data && data.length > 0) {
          setPosts(data.filter((p) => p.is_published));
        } else {
          setPosts(defaultBlogPosts);
        }
      } catch (e) {
        setPosts(defaultBlogPosts);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Settings fallbacks
  const heroHeading = settings.blog_hero_heading || 'Our Archive of Stories & Thoughts';
  const heroSubheading =
    settings.blog_hero_subheading ||
    'Insights, behind-the-scenes perspectives, comic development breakdowns, illustration processes, and visual storytelling essays published by Comic Art Studio.';
  const featuredTitle = settings.blog_featured_title || 'Featured Articles';
  const recentTitle = settings.blog_recent_title || 'Recent Articles';
  const subscribeHeading = settings.blog_subscribe_heading || 'Subscribe to Comic Art Studio Journal';
  const subscribeDesc =
    settings.blog_subscribe_desc ||
    'Quarterly dispatches on design theory, motion architecture, and studio research published on Substack.';
  const subscribeBtnText = settings.blog_subscribe_btn_text || 'Subscribe on Substack';
  const subscribeBtnUrl = settings.blog_subscribe_btn_url || 'https://substack.com';

  // Identify featured vs recent
  const featuredPost = posts.find((p) => p.is_featured) || posts[0];
  const recentPosts = posts.filter((p) => p.id !== featuredPost?.id);

  const handleReadArticle = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const handleSubscribeClick = () => {
    window.open(subscribeBtnUrl, '_blank');
  };

  return (
    <div className="pt-28 pb-20 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto space-y-20 bg-[#050505] text-[#f3f3f3]">
      {/* Page Title */}
      <div className="space-y-4 max-w-3xl pt-8">
        <h1 className="font-outfit text-4xl sm:text-6xl font-light text-white tracking-tight leading-[1.08]">
          {heroHeading}
        </h1>
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e] font-normal leading-relaxed">
          {heroSubheading}
        </p>
      </div>

      {/* Featured Article at Top */}
      {featuredPost && (
        <div className="space-y-4">
          <h2 className="font-outfit text-xl sm:text-2xl font-light text-[#E6A800] tracking-wider uppercase font-medium">
            {featuredTitle}
          </h2>
          <div className="group relative bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[460px] overflow-hidden">
              <img
                src={
                  featuredPost.cover_image ||
                  '/assets/images/hero_nebula_bg_1785513204720.jpg'
                }
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
                    {featuredPost.category_name || 'FEATURED ARTICLE'}
                  </span>
                  <span>{featuredPost.published_at || 'JULY 28, 2026'}</span>
                </div>

                <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-light text-white group-hover:text-white/90 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="font-inter text-sm sm:text-base text-[#9a9a9e] leading-relaxed line-clamp-4">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="font-inter text-xs text-[#9a9a9e]">
                  <span className="text-white block font-medium">
                    {featuredPost.author_name || 'Evelyn Kuroda'}
                  </span>
                  <span>{featuredPost.author_role || 'Design Partner'}</span>
                </div>

                <button
                  onClick={() => handleReadArticle(featuredPost.slug)}
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
        </div>
      )}

      {/* Grid of Recent Articles */}
      <div className="pt-8 border-t border-white/10 space-y-8">
        <h2 className="font-outfit text-2xl sm:text-3xl font-light text-white tracking-tight">
          {recentTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((art) => (
            <article
              key={art.id}
              className="group bg-[#0a0a0c] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#050505]">
                  <img
                    src={
                      art.cover_image ||
                      '/assets/images/project_artwork_1_1785513185877.jpg'
                    }
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between font-inter text-xs text-[#9a9a9e]">
                    <span className="text-[#E6A800] uppercase tracking-wider font-medium">
                      {art.category_name || 'ARTICLES'}
                    </span>
                    <span>{art.published_at || 'JULY 2026'}</span>
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
                <span>By {art.author_name || 'Comic Art Studio Team'}</span>
                <button
                  onClick={() => handleReadArticle(art.slug)}
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

      {/* Journal External Subscription CTA */}
      <div className="pt-16 pb-8 border-t border-white/10 text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="font-outfit text-3xl sm:text-5xl font-light text-white tracking-tight">
          {subscribeHeading}
        </h2>
        <p className="font-inter text-sm sm:text-base text-[#9a9a9e]">
          {subscribeDesc}
        </p>
        <div className="pt-2">
          <button
            onClick={handleSubscribeClick}
            className="inline-flex items-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer active:scale-98"
          >
            <span>{subscribeBtnText}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
