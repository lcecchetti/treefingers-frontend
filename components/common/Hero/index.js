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

  const scrollToDetails = () => detailsRef.current.scrollIntoView({ behavior: 'smooth' });  

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 md:items-stretch items-center min-h-screen-no-header text-center md:text-left">
      <div className="md:col-span-2 flex items-center justify-center flex-col p-md md:p-xl min-h-screen-no-header md:min-h-0">
        <Text className="md:pb-0 pb-14 text-xl" variant="p" as={Typist} avgTypingDelay={50} startDelay={2000}>
          <span className="mb-md md:mb-sm inline-block">"What a big mouth you have!" - Said little red riding hood.</span>
          <br />
          <span className="mb-md md:mb-sm inline-block">"The better to eat you with!" - Growled the wolf.</span>
          <br />
          {heroTexts.map((text, index) => (
            <span key={index}>
              {text}
              <Typist.Backspace count={text.length} delay={500} />
            </span>
          ))}

          <span>Continuing this story is up to your imagination...</span>
        </Text>

        <FaAngleDoubleDown className="md:hidden text-4xl animate-bounce absolute bottom-md" onClick={scrollToDetails}/>
      </div>
      <div ref={detailsRef} className="text-primary-contrast bg-primary px-md py-xl md:px-xl flex flex-col gap-lg md:justify-center items-start min-h-screen-no-header md:min-h-0">
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