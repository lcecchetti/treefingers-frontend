import { Link, Button, Text } from 'components/ui';
import Typist from 'react-typist';

const heroTexts = [
  'Jumping out of the bed and swallowing her in just one bite.',
  'She prontly drew her katana and cut his head off in one single swipe.',
  'After few months he died by too much cholesterol and an unbalanced diet.',
  'A ninja hidden in the closet killed the wolf with his ninja star.',
];

const Hero = () => {

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 md:items-stretch items-center min-h-screen-no-header">
      <div className="md:col-span-2 flex items-center md:justify-center flex-col p-md md:p-xl min-h-screen-no-header md:min-h-0">
        <Text variant="h3" as={Typist} avgTypingDelay={50} startDelay={2000}>
          <span className="mb-sm inline-block">"What a big mouth you have!" - Said little red riding hood.</span>
          <br />
          <span className="mb-sm inline-block">"The better to eat you with!" - Growled the wolf.</span>
          <br />
          {heroTexts.map((text, index) => (
            <span key={index}>
              {text}
              <Typist.Backspace count={text.length} delay={500} />
            </span>
          ))}

          <span>Continuing this story is up to your imagination...</span>
        </Text>
      </div>
      <div className="text-primary-contrast bg-primary p-md md:p-xl flex flex-col md:justify-center items-start min-h-screen-no-header md:min-h-0">
        <div className="mb-lg">
          <Text variant="h2">What is Treefingers?</Text>
          <Text variant="p">
            Treefingers is a place where to tell never ending stories.<br />
            Where writings do not belong to the writer, but to the reader.<br />
            It's about choosing and creating your own choice.
          </Text>
        </div>
        <div className="md:mb-lg">
          <Text variant="h2">How does it work?</Text>
          <Text variant="p">
            Each story is composed by multiple chapters.
            At the end of each chapter, you'll have the choice to pick how the story continues.
            Cannot find an adequate continuation? Write your own and let other people follow your path.
            It's as simple as that.
          </Text>
        </div>
        <div className="w-full">
          <Button as={Link} href="/stories" variant="primary-contrast" className="my-sm">Read</Button>
          <Text variant="span" className="m-sm">- Or -</Text>
          <Button as={Link} href="/story/new" variant="primary-contrast" className="my-sm">Write</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;