import { useState } from 'react';
import { Link, Spinner, Text, Button } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { StoryNew } from 'components/story';
import { FaAngleDown } from 'react-icons/fa';
import { getStoryUrl } from 'lib/helper';
import { FaTimes } from 'react-icons/fa';

/**
 * Chapter list query
 * @type {gql}
 */
export const QUERY_CHAPTERS = gql`
  query stories($where: JSON) {
    stories(where: $where) {
      id
      action
      root {
        id
      }
    }
  }
`;

const ChapterChoice = ({ className, parent }) => {

  const [isWriting, setIsWriting] = useState(false);

  const { data, loading, error } = useQuery(QUERY_CHAPTERS, {
    variables: {
      where: {
        parent: parent?.id,
      }
    }
  });

  return (
    <div>
      {!isWriting && // chapter list section
        <div className={clsx('mx-auto max-w-screen-sm', className)}>
          {loading && <Spinner />}

          {error && <Text variant="error">{error.message}</Text>}

          {data &&
            <div className="flex flex-col gap-md">

              {!!data?.stories.length && // chapter list
                <div className="flex flex-col gap-xs">
                  <div className="flex flex-col items-center justify-center gap-xs">
                    <Text variant="span" className="font-bold uppercase">What's next? </Text>
                    <FaAngleDown className="text-3xl animate-bounce" />
                  </div>
                  <ul className="flex flex-col border-2 rounded-xl overflow-hidden gap-px bg-primary">
                    {data.stories.map((chapter) => (
                      <li key={chapter.id} className="p-sm bg-base">
                        <Link href={getStoryUrl(chapter)} underline={false} className="block">{chapter.action}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              }

              <div className="text-center flex flex-col gap-xs">
                {!data.stories.length &&
                  <Text variant="title" as="span" className="">The end...?</Text>
                }

                <Button className="w-full" onClick={() => setIsWriting(true)}>Write a new chapter</Button>
              </div>
            </div>
          }

        </div>
      }

      {isWriting && // writing section
        <div className="relative pt-md">
          <div className="flex gap-xs justify-between items-center">
            <Text variant="h3" as="span" className="uppercase font-bold">What's next?</Text>
            <FaTimes className="text-2xl cursor-pointer" onClick={() => setIsWriting(false)} />
          </div>
          <StoryNew parent={parent} />
        </div>  
      }
    </div>
  );
};

export default ChapterChoice;

