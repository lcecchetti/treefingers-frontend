declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// gtag is only defined once the GA script has loaded, which now only happens
// after cookie consent is granted, so callers can't assume it's present
const isGtagAvailable = (): boolean => typeof window !== 'undefined' && typeof window.gtag === 'function';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (!isGtagAvailable()) return;

  window.gtag?.('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

interface GtagEventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GtagEventParams): void => {
  if (!isGtagAvailable()) return;

  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
