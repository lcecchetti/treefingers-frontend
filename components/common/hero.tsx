import { useRef } from 'react';
import { Link, Button, Text } from '@/components/ui';
import { useTypewriter, type TypewriterSegment } from '@/lib/hooks/use-typewriter';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { getForestsUrl } from '@/lib/helper/forest';
import { getStoryNewUrl } from '@/lib/helper/story';

const heroTexts: string[] = [
  'In just one bite, he jumped out of the bed and swallowed her whole.',
  'In one swift action, she drew her katana and cut off his head.',
  'His unbalanced diet and too much cholesterol led to his death within a few months.',
  'The wolf was killed by a ninja hidden in the closet with his ninja star.',
];

const typewriterSegments: TypewriterSegment[] = [
  ...heroTexts.map((text) => ({ text, backspace: true })),
  { text: 'Continuing this story is up to you...' },
];

export const Hero = () => {
  const detailsRef = useRef<HTMLDivElement>(null);
  const scrollToDetails = () => window.scrollTo({ top: (detailsRef.current?.offsetTop ?? 0) - (document.getElementById('header')?.offsetHeight ?? 0), behavior: 'smooth' });
  const typed = useTypewriter(typewriterSegments, { typingDelayMs: 50, startDelayMs: 3000 });

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 lg:items-stretch items-center min-h-screen-no-header text-center lg:text-left">
      <div className="lg:col-span-2 flex items-center justify-center flex-col p-md min-h-screen-no-header lg:min-h-0">
        <div className="lg:pb-0 pb-14 text-xl flex flex-col gap-md">
          <Text>"What a big mouth you have!" - Said little red riding hood.</Text>
          <Text>"The better to eat you with!" - Growled the wolf.</Text>
          <span>{typed}<span className="animate-pulse">|</span></span>
        </div>

        <FaAngleDoubleDown className="lg:hidden text-4xl animate-bounce absolute bottom-md" onClick={scrollToDetails}/>
      </div>
      <div ref={detailsRef} className="text-primary-contrast bg-primary px-md py-xl lg:px-2xl flex flex-col justify-center gap-lg lg:justify-center items-start min-h-screen-no-header lg:min-h-0">
        <div className="w-full flex flex-col gap-sm">
          <Text variant="h2">What is Treefingers?</Text>
          <Text variant="p">
            Treefingers is a place to tell never-ending stories.<br />
            Where writings do not belong to the writer, but to the reader.<br />
            It's about choosing and creating your own path.
          </Text>
        </div>
        <div className="w-full flex flex-col gap-sm">
          <Text variant="h2">How does it work?</Text>
          <Text variant="p">
            Each story is composed of multiple chapters.
            At the end of each chapter, you'll have the choice to pick how the story continues.
            Cannot find an adequate continuation? Write your own and let other people follow your path.
            It's as simple as that.
          </Text>
        </div>
        <div className="w-full">
          <Button as={Link} href={getForestsUrl()} variant="primary-contrast" className="my-sm">Read</Button>
          <Text variant="span" className="m-sm">- Or -</Text>
          <Button as={Link} href={getStoryNewUrl()} variant="primary-contrast" className="my-sm">Write</Button>
        </div>
      </div>
    </div>
  );
};
