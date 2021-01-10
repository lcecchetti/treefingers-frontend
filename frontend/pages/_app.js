import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'lib/apollo/client';
import { Header, Footer } from 'components/common';

// global style dependencies
import 'styles/globals.css'

const Noop = ({ children }) => children;

export default function App({ Component, pageProps }) {

  // delegate layout responsibility to the page to preserve top level component status
  const Layout = Component.Layout || Noop;

  // prepare apollo client
  const apolloClient = useApollo(pageProps);

  return (
    <>
      <Head>
        <title>treefingers.space</title>
        <meta name="theme-color" content="#000" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <Header />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Footer />
      </ApolloProvider>
    </>
  );
};