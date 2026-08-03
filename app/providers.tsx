'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ApolloProvider } from '@apollo/client';
import { initializeApollo } from '@/lib/apollo/client';
import { Flyout, CookieConsent, Toasts } from '@/components/common';
import { ThemeProvider } from 'next-themes';
import { UIProvider } from '@/lib/ui/context';
import { CookiesProvider, useCookies } from 'react-cookie';
import { COOKIE_CONSENT_NAME, COOKIE_CONSENT_ACCEPTED } from '@/lib/helper/cookie-consent';
import * as gtag from '@/lib/gtag';
import Script from 'next/script';
import type { ReactNode } from 'react';

// must be rendered inside CookiesProvider to share its Cookies instance
// with CookieConsent, otherwise consent changes aren't picked up here
const AnalyticsScripts = () => {
  const [cookies] = useCookies([COOKIE_CONSENT_NAME]);
  const hasAnalyticsConsent = cookies[COOKIE_CONSENT_NAME] === COOKIE_CONSENT_ACCEPTED;

  if (!hasAnalyticsConsent) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

// next/navigation has no router.events equivalent, so page views are
// tracked from the (pathname, searchParams) pair changing instead of a
// routeChangeComplete/hashChangeComplete event pair
const PageviewTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    gtag.pageview(search ? `${pathname}?${search}` : pathname);
  }, [pathname, searchParams]);

  return null;
};

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const apolloClient = useMemo(() => initializeApollo(), []);

  return (
    <CookiesProvider>
      {/* Global Site Tag (gtag.js) - Google Analytics, only loaded once cookie consent is granted */}
      <AnalyticsScripts />
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider attribute="class">
          <UIProvider>
            {children}
            <Flyout />
            <Toasts />
            <CookieConsent />
          </UIProvider>
        </ThemeProvider>
      </ApolloProvider>
    </CookiesProvider>
  );
};
