import { useRef } from 'react';
import { Link, Button, Text } from 'components/ui';
import Typist from 'react-typist';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { getForestNewUrl, getForestsUrl } from 'lib/helper/forest';

const heroTexts = [
  'Jumping out of the bed and swallowing her in just one bite.',
  'She prontly drew her katana and cut his head off in one single swipe.',
  'After few months he died by too much cholesterol and an unbalanced diet.',
  'A ninja hidden in the closet killed the wolf with his ninja star.',
];

const Hero = () => {
  const detailsRef = useRef(null);
  const scrollToDetails = () => window.scrollTo({ top: detailsRef.current.offsetTop - document.getElementById('header').offsetHeight, behavior: 'smooth' });

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 lg:items-stretch items-center min-h-screen-no-header text-center lg:text-left">
      <div className="lg:col-span-2 flex items-center justify-center flex-col p-md min-h-screen-no-header lg:min-h-0">
        <div className="lg:pb-0 pb-14 text-xl flex flex-col gap-md">
          <Text>"What a big mouth you have!" - Said little red riding hood.</Text>
          <Text>"The better to eat you with!" - Growled the wolf.</Text>
          <Typist avgTypingDelay={50} startDelay={3000}>
            {heroTexts.map((text, index) => (
              <span key={index}>
                {text}
                <Typist.Backspace count={text.length} delay={500} />
              </span>
            ))}
            <span>Continuing this story is up to your imagination...</span>
          </Typist>
        </div>

        <FaAngleDoubleDown className="lg:hidden text-4xl animate-bounce absolute bottom-md" onClick={scrollToDetails}/>
      </div>
      <div ref={detailsRef} className="text-primary-contrast bg-primary px-md py-xl lg:px-2xl flex flex-col gap-lg lg:justify-center items-start min-h-screen-no-header lg:min-h-0">
        <div className="w-full flex flex-col gap-sm">
          <Text variant="h2">What is Treefingers?</Text>
          <Text variant="p">
            Treefingers is a place where to tell never ending stories.<br />
            Where writings do not belong to the writer, but to the reader.<br />
            It's about choosing and creating your own choice.
          </Text>
        </div>
        <div className="w-full flex flex-col gap-sm">
          <Text variant="h2">How does it work?</Text>
          <Text variant="p">
            Each story is composed by multiple chapters.
            At the end of each chapter, you'll have the choice to pick how the story continues.
            Cannot find an adequate continuation? Write your own and let other people follow your path.
            It's as simple as that.
          </Text>
        </div>
        <div className="w-full">
          <Button as={Link} href={getForestsUrl()} variant="primary-contrast" className="my-sm">Read</Button>
          <Text variant="span" className="m-sm">- Or -</Text>
          <Button as={Link} href={getForestNewUrl()} variant="primary-contrast" className="my-sm">Write</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;