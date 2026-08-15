import { useEffect } from 'react';
import { adminApi } from '../admin/services/adminApi';

/**
 * Records a page_view analytics event once when the page mounts.
 * Fire-and-forget: never blocks rendering, never throws.
 */
export function useTrackPageView(pageId: string) {
  useEffect(() => {
    adminApi.trackEvent('page_view', pageId);
    // Intentionally only on mount — a single page_view per visit to this route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
