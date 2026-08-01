import { DefaultLayout } from 'components/layout';
import { Hero } from 'components/common';
import Head from 'next/head';
import type { NextPageWithLayout } from 'lib/types/next';

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Treefingers | Collaborative writing</title>
        <meta name="description" content="Treefingers is a collaborative writing app to tell never-ending stories."/>
      </Head>
      <Hero />
    </>
  );
};

HomePage.Layout = DefaultLayout;

export default HomePage;
