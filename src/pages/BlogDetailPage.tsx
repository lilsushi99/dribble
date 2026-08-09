import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi, defaultBlogPosts } from '../admin/services/adminApi';
import { BlogPostItem } from '../admin/types/admin.types';
import { useSettings } from '../context/SettingsContext';
import { ArrowLeft, Calendar, User, Clock, Share2, Globe, Tag } from 'lucide-react';

interface BlogDetailPageProps {
  onOpenBookCall?: () => void;
}

export default function BlogDetailPage({ onOpenBookCall }: BlogDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await adminApi.getBlogPostBySlug(slug);
        if (data) {
          setPost(data);
        } else {
          const fallback = defaultBlogPosts.find((p) => p.slug === slug);
          setPost(fallback || null);
        }
      } catch (e) {
        const fallback = defaultBlogPosts.find((p) => p.slug === slug);
        setPost(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  // Document Title & SEO Update
  useEffect(() => {
    if (post) {
      document.title = post.meta_title || `${post.title} | Comic Art Studio`;
    }
  }, [post]);

  const subscribeHeading = settings.blog_subscribe_heading || 'Subscribe to Comic Art Studio Journal';
  const subscribeDesc = settings.blog_subscribe_desc || 'Quarterly dispatches on design theory, motion architecture, and studio research published on Substack.';
  const subscribeBtnText = settings.blog_subscribe_btn_text || 'Subscribe on Substack';
  const subscribeBtnUrl = settings.blog_subscribe_btn_url || 'https://substack.com';

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto text-center space-y-4 text-white">
        <div className="w-8 h-8 border-2 border-[#0097FF] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#9a9a9e]">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto text-center space-y-6 text-white">
        <h1 className="font-outfit text-3xl font-light">Article Not Found</h1>
        <p className="text-sm text-[#9a9a9e]">
          The blog article you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-[#0097FF] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6 sm:px-12 md:px-16 max-w-4xl mx-auto space-y-12 bg-[#050505] text-[#f3f3f3]">
      {/* Navigation Back */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9a9a9e] hover:text-[#0097FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 font-inter text-xs text-[#9a9a9e]">
          <span className="text-[#E6A800] uppercase font-semibold tracking-wider">
            {post.category_name || 'Sequential Art'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.read_time || '6 min read'}
          </span>
        </div>

        <h1 className="font-outfit text-3xl sm:text-5xl font-light text-white tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="font-inter text-base sm:text-lg text-[#9a9a9e] leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Author & Meta Line */}
        <div className="pt-4 border-t border-b border-white/10 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9a9a9e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0097FF]/20 text-[#0097FF] flex items-center justify-center font-bold text-sm">
              {(post.author_name || 'C')[0]}
            </div>
            <div>
              <span className="text-white block font-medium">
                {post.author_name || 'Comic Art Studio Team'}
              </span>
              <span className="text-[11px] text-[#9a9a9e]">
                {post.author_role || 'Editorial Partner'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at || 'July 2026'}
            </span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }
              }}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Share Article"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      {post.cover_image && (
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src={post.cover_image}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* Main Formatted Body */}
      <article
        className="prose prose-invert max-w-none text-[#d1d1d6] font-inter text-sm sm:text-base leading-relaxed text-justify space-y-6 border-b border-white/10 pb-12"
        dangerouslySetInnerHTML={{
          __html:
            post.content ||
            `<p>${post.excerpt || 'Article content is being formatted.'}</p>`,
        }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Tag className="w-4 h-4 text-[#9a9a9e]" />
          {post.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-[#9a9a9e]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* External Subscribe CTA */}
      <div className="pt-12 pb-6 text-center space-y-6 bg-[#0a0a0c] p-8 sm:p-12 rounded-3xl border border-white/10">
        <h2 className="font-outfit text-2xl sm:text-4xl font-light text-white tracking-tight">
          {subscribeHeading}
        </h2>
        <p className="font-inter text-xs sm:text-sm text-[#9a9a9e] max-w-xl mx-auto">
          {subscribeDesc}
        </p>
        <button
          onClick={() => window.open(subscribeBtnUrl, '_blank')}
          className="inline-flex items-center gap-2 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-6 py-3 text-xs font-semibold transition-all cursor-pointer active:scale-95"
        >
          <span>{subscribeBtnText}</span>
          <Globe className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
