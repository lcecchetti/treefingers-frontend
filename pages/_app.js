import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'lib/apollo/client';
import { Header, Footer, Flyout, CookieConsent, Toasts } from 'components/common';
import { ThemeProvider } from 'next-themes';
import { UIProvider } from 'lib/ui/context';
import { CookiesProvider } from 'react-cookie';
import * as gtag from 'lib/gtag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script'

// global style dependencies
import 'styles/globals.css'

const Noop = ({ children }) => children;

const App = ({ Component, pageProps }) => {

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    }
  }, [router.events]);

  // delegate layout responsibility to the page to preserve top level component status
  const Layout = Component.Layout || Noop;

  // prepare apollo client
  const apolloClient = useApollo(pageProps);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
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
      <Head>
        <title>Treefingers</title>
        <meta name="theme-color" content="#000" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <CookiesProvider>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider attribute="class">
            <UIProvider>
              <Header/>
              <Layout>
                <Component {...pageProps}/>
              </Layout>
              <Footer/>
              <Flyout/>
              <Toasts/>
              <CookieConsent/>
            </UIProvider>
          </ThemeProvider>
        </ApolloProvider>
      </CookiesProvider>
    </>
  );
};

export default App;