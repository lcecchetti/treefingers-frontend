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
    <div className="flex md:flex-row flex-col items-center min-h-screen">
      <div className="md:w-2/3 flex items-center flex-col p-md md:p-xl min-h-screen md:min-h-0">
        <Text variant="h2" as={Typist} avgTypingDelay={50} startDelay={2000}>
          <span>"What a big mouth you have!" - Said little red riding hood.</span>
          <br /><br />

          <span>"The better to eat you with!" - Growled the wolf.</span>
          <br /><br />

          {heroTexts.map((text, index) => (
            <span>
              {text}
              <Typist.Backspace count={text.length} delay={500} />
            </span>
          ))}

          <span>Continuing this story is up to your fantasy...</span>
        </Text>
      </div>
      <div className="md:w-1/3 bg-primary px-md py-xl md:px-xl min-h-screen">
        <Text className="text-primary-contrast" variant="p">Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet </Text>
        <Button as={Link} href="#" size="lg" variant="primary-contrast" className="mx-auto my-sm block">Button</Button>
      </div>
    </div>
  );
};

export default Hero;