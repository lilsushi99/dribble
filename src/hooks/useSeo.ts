import { useEffect } from 'react';
import { adminApi } from '../admin/services/adminApi';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Applies the CMS-managed SEO record for a given page to document.title and the
 * relevant meta tags. Falls back to the 'global' record for any field the specific
 * page hasn't set, and leaves existing tags alone if neither is set.
 */
export function useSeo(pageKey: string) {
  useEffect(() => {
    let isMounted = true;
    adminApi
      .getSeoSettings()
      .then((data) => {
        if (!isMounted || !data) return;
        const pageRecord = data[pageKey] || {};
        const globalRecord = data.global || {};
        const record = { ...globalRecord, ...pageRecord };

        if (record.meta_title) document.title = record.meta_title;
        if (record.meta_description) setMetaTag('name', 'description', record.meta_description);
        if (record.keywords) setMetaTag('name', 'keywords', record.keywords);
        if (record.og_title) setMetaTag('property', 'og:title', record.og_title);
        if (record.og_description) setMetaTag('property', 'og:description', record.og_description);
        if (record.og_image_url) setMetaTag('property', 'og:image', record.og_image_url);

        if (record.canonical_url) {
          let link = document.querySelector('link[rel="canonical"]');
          if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
          }
          link.setAttribute('href', record.canonical_url);
        }
      })
      .catch(() => {
        // Leave whatever title/meta tags are already present untouched on failure.
      });
    return () => {
      isMounted = false;
    };
  }, [pageKey]);
}
