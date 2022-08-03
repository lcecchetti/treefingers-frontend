import { DefaultLayout } from 'components/layout';
import { Hero } from 'components/common';
import Head from 'next/head';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Treefingers | Collaborative writing</title>
        <meta name="description" content="Treefingers is a collaborative writing app where to tell endless stories."/>
      </Head>
      <Hero />
    </>
  );
};

HomePage.Layout = DefaultLayout;

export default HomePage;