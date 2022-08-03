import { DefaultLayout } from 'components/layout';
import { Container, Text, Link } from 'components/ui';
import Head from 'next/head';

const AboutPage = () => {
  return (
    <Container className="flex flex-col gap-lg">
      <Head>
        <title>About | Treefingers</title>
        <meta name="description" content="Treefingers is a collaborative writing app that tries to gamify choose your own adventure stories."/>
      </Head>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-md lg:items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-lg min-h-screen-no-header justify-center">
          <Text variant="pageTitle" className="text-center">About Treefingers</Text>
          <div className="flex flex-col gap-sm">
            <Text variant="subtitle" as="h2">Collaborative writing</Text>
            <Text>Collaborative writing is the process of producing a text by sharing multiple individuals creativity. Treefingers tries to gamify this experience in a way similar to the "choose your own adventure" books that were popular in the 80s. That kind of books had the problem of proposing a unidirectional communication, where the reader could not take any action a part from the ones available at the end of each chapter. And all of those actions would take to some dead end eventually. Treefingers tries to remove this limitation by giving each reader the title of author, and each author the title of reader. "Author" is in this case just the person planting the seed, but the tree, the forest, and the growing process will be on community hands.</Text>
          </div>
          <div className="flex flex-col gap-sm">
            <Text variant="subtitle">Feedback</Text>
            <Text>You have any good idea you'd like to see on Treefingers? Any issue to report?<br/>Send us a message at <Link href="mailto:treefingers.co@gmail.com" className="font-bold">treefingers.co@gmail.com</Link></Text>
          </div>
        </div>
        <div className="text-primary-contrast p-lg bg-primary min-h-screen-no-header justify-center flex flex-col gap-md">
          <Text variant="pageSubtitle">F.A.Q.</Text>

          <div className="flex flex-col gap-sm">
            <Text variant="h3">What is a forest?</Text>
            <Text>A forest is a container of stories. It's both a place where to grow common themed stories and a community to take care of them. Look through the topics other authors created, or create your own.</Text>
          </div>

          <div className="flex flex-col gap-sm">
            <Text variant="h3">What is a story?</Text>
            <Text>A story is a tree of chapters. A title, some content and a forest where to grow it: you'll need nothing more. Tag it, if you wish, to let others search for it easily. Each story is rapresented as a unique tree which will grow depending on the interactions on the story.</Text>
          </div>

          <div className="flex flex-col gap-sm">
            <Text variant="h3">What is a chapter?</Text>
            <Text>A chapter is the continuation of a story. It's the smallest bulding block and yet the most creative one. In case of chapters, their title will be used as the action that will appear in the chapters selection for the next person to come.</Text>
          </div>
        </div>
      </div>
    </Container>
  );
};

AboutPage.Layout = DefaultLayout;

export default AboutPage;